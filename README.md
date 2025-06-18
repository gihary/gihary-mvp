# Gihary MVP

This repository outlines a minimal setup for the **Gihary MVP**. The project is currently a stub and does not include Gmail integration, Firestore storage, or agent modules.

## Features

- **Gmail integration** – Connects to a Gmail account using OAuth to fetch emails.
- **Task extraction via LLM** – Parses messages with a language model to generate actionable tasks.
- **Firestore storage** – Persists tasks and related information in Google Firestore.
- **Agent orchestration** – Coordinates multiple agents to respond to user requests and manage tasks.
- **Contextual memory** – Maintains conversational context for more accurate responses.
This README provides a high-level overview. Implementations of Gmail access, task extraction logic, and Firestore storage can be added in the `src/index.js` entry point.

## Setup

1. **Node.js**
   - Install Node.js version **18 or higher**. The project requires Node
     18 or newer as defined in `package.json`.
   - Clone this repository. The project currently has no external
     dependencies because the Google AI Edge packages referenced in the
     code have not yet been published.
   - Run `npm install` anyway so that future dependencies can be installed
     without changing these steps:
     ```bash
     npm install
     ```

2. **Gmail OAuth configuration**
   - Create OAuth credentials in the [Google Cloud Console](https://console.cloud.google.com/).
   - Enable the Gmail API and download your OAuth client ID and secret.
   - Provide the redirect URI for local development (e.g., `http://localhost:3000/oauth2callback`).
   - Store the credentials in an environment file or pass them as environment variables:
     ```bash
     export GMAIL_CLIENT_ID="<your-client-id>"
     export GMAIL_CLIENT_SECRET="<your-client-secret>"
     export GMAIL_REDIRECT_URI="<your-redirect-uri>"
     ```

3. **Firestore configuration**
   - Create a project in the Google Cloud Console and enable Firestore.
   - Generate a service account JSON key file and set the path via the `GOOGLE_APPLICATION_CREDENTIALS` environment variable:
     ```bash
     export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your-service-account.json"
     ```

4. **Running the project**
   - Ensure all environment variables above are configured.
   - Start the application with Node.js:
     ```bash
     node src/index.js
     ```

## Example commands
```bash
npm install      # install dependencies
node src/index.js    # run the project
```

When the Google AI Edge packages become publicly available, add them to
`package.json` and run `npm install` again to install the libraries.

