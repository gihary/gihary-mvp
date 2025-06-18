# Gihary MVP

This repository outlines a minimal setup for the **Gihary MVP**. It now
includes basic Gmail integration, Firestore helpers and an onboarding wizard
that stores client profiles.

## Features

- **Gmail integration** – Connects to a Gmail account using OAuth to fetch emails.
- **Task extraction via LLM** – Parses messages with a language model to generate actionable tasks.
- **Firestore storage** – Persists tasks and related information in Google Firestore.
- **Onboarding wizard** – CLI prompts to collect client details.
- **CRM module** – Saves onboarding results under `clients/{email}/profile` in Firestore.

This README provides a high-level overview of the modules available in the `src/` directory.

## Come iniziare

1. **Node.js**
   - Install Node.js version **18 or higher**. The project requires Node
     18 or newer as defined in `package.json`.
   - Clone this repository.
   - Run `npm install` to install dependencies:
    ```bash
    npm install
    ```
  - Copy `.env.sample` to `.env` and fill in your environment variables. The
    project uses [dotenv](https://www.npmjs.com/package/dotenv) to load
    this file automatically.

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
   - Crea un progetto su Google Cloud e abilita Firestore.
   - Ottieni le credenziali dell'account di servizio e imposta le variabili:
     ```bash
     export FIREBASE_PROJECT_ID="<id-progetto>"
     export FIREBASE_CLIENT_EMAIL="<email-servizio>"
     export FIREBASE_PRIVATE_KEY="<chiave-privata>"
     ```

4. **Running the project**
   - Ensure all environment variables above are configured. Copy `.env.sample`
     to `.env` and fill in the placeholders.
   - Avvia l'applicazione:
     ```bash
     npm start
     ```
   - On first run the onboarding wizard collects your client details and stores
     them in Firestore.

## Esempio di avvio
```bash
npm install      # install dependencies
npm start        # avvia l'applicazione
```

When the Google AI Edge packages become publicly available, add them to
`package.json` and run `npm install` again to install the libraries.

## Come testare

Assicurati di aver eseguito `npm install` prima dei test:

```bash
npm install      # install dependencies once
npm test         # run the test suite
```

`npm start` richiede le dipendenze installate con `npm install`.

## Script CLI utili

```bash
npm run debug      # controlla variabili .env e dipendenze
npm run rollback -- --email=utente@example.com  # ripristina l'ultimo profilo
```

`npm run debug` verifica che tutte le variabili richieste siano presenti nel file
`.env` e che i moduli necessari siano installati. Lancialo quando configuri un
nuovo ambiente o se l'applicazione non parte correttamente.

`npm run rollback` ripristina l'ultimo profilo salvato in Firestore per
l'indirizzo specificato. È utile in caso di modifiche sbagliate o se vuoi
tornare alla versione precedente dei dati di un cliente.

