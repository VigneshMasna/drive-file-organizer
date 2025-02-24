/**
 * Drive Organizer Add-on
 * This script organizes files in a Google Drive folder by extracting Subject ID and Year from documents.
 */

/**
 * Entry point for the add-on homepage.
 */
function onHomepage(e) {
  const userProperties = PropertiesService.getUserProperties();
  const folderId = userProperties.getProperty("folderId");

  if (!folderId) {
    return createFolderIdPrompt();
  } else {
    return onUpload(folderId);
  }
}

/**
 * Creates a UI card prompting the user to enter the Folder ID.
 */
function createFolderIdPrompt() {
  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Drive Organizer Add-on"))
    .addSection(
      CardService.newCardSection()
        .addWidget(
          CardService.newTextParagraph().setText("Enter the Folder ID where your files are stored:")
        )
        .addWidget(
          CardService.newTextInput()
            .setFieldName("folderId")
            .setTitle("Folder ID")
            .setHint("Paste your Google Drive folder ID here")
        )
        .addWidget(
          CardService.newButtonSet()
            .addButton(
              CardService.newTextButton()
                .setText("Save Folder Id")
                .setOnClickAction(
                  CardService.newAction()
                    .setFunctionName("saveFolderId")
                    .setParameters({})
                    .setLoadIndicator(CardService.LoadIndicator.SPINNER)
                )
            )
        )
    )
    .build();

  return [card];
}

/**
 * Saves the Folder ID provided by the user after validating its existence.
 */
function saveFolderId(e) {
  const formInputs = e.commonEventObject.formInputs;
  const inputFolderId = formInputs?.folderId?.stringInputs?.value[0];

  if (!inputFolderId) {
    return showErrorCard("Please enter a valid Folder ID before saving.");
  }

  // Validate Folder ID by attempting to get the folder.
  try {
    DriveApp.getFolderById(inputFolderId);
  } catch (error) {
    return showErrorCard("Invalid Folder ID! Please check and try again.");
  }

  PropertiesService.getUserProperties().setProperty("folderId", inputFolderId);

  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Drive Organizer Add-on"))
    .addSection(
      CardService.newCardSection()
        .addWidget(CardService.newTextParagraph().setText("Folder ID saved successfully"))
    )
    .build();

  return [card];
}

/**
 * Processes files in the specified folder by extracting information and organizing them.
 */
function onUpload(folderId) {
  const parentFolder = DriveApp.getFolderById(folderId);
  const files = parentFolder.getFiles();

  if (!files.hasNext()) {
    return showResultsCard("No files found in the selected folder.");
  }

  while (files.hasNext()) {
    const file = files.next();
    const extractionResult = extractSubjectId(file);
    const targetFolder = getOrCreateFolder(extractionResult.subId, extractionResult.year, folderId);

    if (targetFolder) {
      file.moveTo(targetFolder);
    }
  }

  return showResultsCard("Files Organized Successfully");
}

/**
 * Extracts the Subject ID and Year from a file by converting it to a Google Doc and processing its content.
 */
function extractSubjectId(file) {
  const blob = file.getBlob();
  const resource = {
    title: file.getName(),
    mimeType: 'application/vnd.google-apps.document'
  };

  // Convert file to a Google Doc.
  const docFile = Drive.Files.insert(resource, blob);
  const docId = docFile.id;
  const doc = DocumentApp.openById(docId);

  let textContent = doc.getBody().getText();
  const header = doc.getHeader();
  const footer = doc.getFooter();

  if (header) {
    textContent += "\n" + header.getText();
  }

  if (footer) {
    textContent += "\n" + footer.getText();
  }

  const result = extractSubjectIdFromText(textContent);

  // Clean up the temporary document.
  DriveApp.getFileById(docId).setTrashed(true);

  return result;
}

/**
 * Uses regular expressions to extract Subject ID and Year from text.
 */
function extractSubjectIdFromText(text) {
  const subjectRegex = /([A-Z]\d{2}[A-Z]{2,3}\d{2,3}[A-Z]{2})/i;
  const yearRegex = /\b(20\d{2})\b/i;
  const result = { subId: null, year: null };

  const subjectMatch = text.match(subjectRegex);
  if (subjectMatch) {
    result.subId = subjectMatch[0];
  }

  const yearMatch = text.match(yearRegex);
  if (yearMatch) {
    result.year = yearMatch[0];
  }

  return result;
}

/**
 * Retrieves or creates a folder based on the Subject ID and Year.
 */
function getOrCreateFolder(subjectId, year, parentFolderId) {
  const parentFolder = DriveApp.getFolderById(parentFolderId);

  // Default to "Miscellaneous" if subjectId or year is not provided.
  subjectId = subjectId || "Miscellaneous";
  year = year || "Miscellaneous";

  let subjectFolder;
  const subjectFolders = parentFolder.getFoldersByName(subjectId);
  if (subjectFolders.hasNext()) {
    subjectFolder = subjectFolders.next();
  } else {
    subjectFolder = parentFolder.createFolder(subjectId);
  }

  let yearFolder;
  const yearFolders = subjectFolder.getFoldersByName(year);
  if (yearFolders.hasNext()) {
    yearFolder = yearFolders.next();
  } else {
    yearFolder = subjectFolder.createFolder(year);
  }

  return yearFolder;
}

/**
 * Displays a card with the results message and a Reset Folder ID button.
 */
function showResultsCard(message) {
  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Processing Completed"))
    .addSection(
      CardService.newCardSection()
        .addWidget(CardService.newTextParagraph().setText(message))
    )
    .addSection(
      CardService.newCardSection()
        .addWidget(
          CardService.newButtonSet().addButton(
            CardService.newTextButton()
              .setText("Reset Folder ID")
              .setOnClickAction(CardService.newAction().setFunctionName("resetFolderId"))
          )
        )
    )
    .build();

  return [card];
}

/**
 * Resets the stored Folder ID and returns to the Folder ID prompt.
 */
function resetFolderId() {
  PropertiesService.getUserProperties().deleteProperty("folderId");
  return createFolderIdPrompt();
}

/**
 * Displays an error card with a message and a Try Again button.
 */
function showErrorCard(message) {
  const card = CardService.newCardBuilder()
    .setHeader(CardService.newCardHeader().setTitle("Error"))
    .addSection(
      CardService.newCardSection()
        .addWidget(CardService.newTextParagraph().setText(message))
    )
    .addSection(
      CardService.newCardSection()
        .addWidget(
          CardService.newTextButton()
            .setText("Try Again")
            .setOnClickAction(CardService.newAction().setFunctionName("onHomepage"))
        )
    )
    .build();

  return [card];
}
