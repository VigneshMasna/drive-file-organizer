# Drive File Organizer

Drive File Organizer is a Google Apps Script add-on that automatically organizes files in a specified Google Drive folder. It extracts key information (Subject ID and Year) from Google Documents and moves files into corresponding subfolders based on this data, simplifying file management.

## Features

- **Automated Organization:** Extracts Subject ID and Year from document content to determine the correct destination folder.
- **Dynamic Folder Creation:** Automatically creates subfolders based on the extracted Subject ID and Year, or uses existing ones.
- **User-Friendly Interface:** Provides an interactive UI to input and validate the Google Drive Folder ID.
- **Error Handling:** Displays clear error messages for invalid Folder IDs and missing data.

## Prerequisites

- A Google account with access to Google Drive.
- Basic familiarity with Google Apps Script.
- Advanced Google Services enabled:
  - Drive API (v2)

## Installation

### 1. Clone the Repository

Clone this repository to your local machine using the following commands:

```bash
git clone https://github.com/VigneshMasna/drive-file-organizer.git
cd drive-file-organizer
```

### 2. Set Up Your Apps Script Project

#### Create a New Project:
- Go to [Google Apps Script](https://script.google.com/) and create a new project.

#### Add Files:
- Replace the default `Code.gs` with the `code.gs` file from this repository.
- Add the `appscript.json` file to your project’s configuration.
- If your Subject ID and Year formats are different, update **`regexSub`** and **`regexYear`** in the `code.gs` file (lines 150 and 151) to match your pattern.

#### Enable Advanced Services:
- In your Apps Script project, navigate to **Services**.
- Enable **Drive API (v2)**.

### 3. Configure the Project on Google Cloud Console

1. **Create a New Project:**
   - Visit [Google Cloud Console](https://console.cloud.google.com/) and create a new project.

2. **Enable APIs:**
   - Navigate to **APIs & Services > Library**.
   - Search for and enable the following APIs:
     - Google Drive API
     - Apps Script API

3. **Configure OAuth Consent Screen:**
   - Go to **APIs & Services > Credentials**.
   - Click on **Configure Consent Screen** and fill in the required details.

4. **Add OAuth Scopes:**
   - Under the OAuth consent screen, add the following scopes:
     - `https://www.googleapis.com/auth/script.container.ui`
     - `https://www.googleapis.com/auth/drive.file`
     - `https://www.googleapis.com/auth/drive`
     - `https://www.googleapis.com/auth/documents`
     - `https://www.googleapis.com/auth/script.locale`
     - `https://www.googleapis.com/auth/script.scriptapp`

5. **Associate the Cloud Project with Your Apps Script Project:**
   - Copy your **Project Number** from the **Project Info** section in Google Cloud Console.
   - In your Apps Script project, navigate to **Project Settings** and paste your Project Number under the **Google Cloud Platform (GCP) Project** section.

## Usage

### Deploy the Add-on

1. In your Apps Script project, navigate to **Deploy > Test deployments**.
2. Select the deployment type as **Google Workspace Add-on**.
3. Click **Install**.
4. Open the add-on from Google Drive. The homepage will prompt you to authorize access.
5. Grant the necessary permissions for the add-on to access your Google Drive.

### Enter Folder ID

1. Open the add-on from Google Drive.
2. Enter the Folder ID where your files are stored.
3. Click **Save Folder Id**. The script will validate the folder before saving.

### Organize Files

- Once the Folder ID is set, the add-on processes all files in the specified folder.
- Files are moved to subfolders based on the extracted Subject ID and Year. If either piece of data is missing, files are placed in a "Miscellaneous" folder.

## Project Structure

```
📂 drive-file-organizer
│-- 📄 code.gs          # Main logic for processing and organizing files
│-- 📄 appscript.json   # Apps Script configuration file
│-- 📄 README.md        # Documentation file
```

## Contributions

Contributions are welcome! Feel free to fork the repository and submit a pull request with your improvements. For major changes, please open an issue first to discuss your ideas.

