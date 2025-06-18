# Gihary MVP

This repository contains a small proof of concept for the **Gihary MVP**. The codebase is intentionally minimal and focuses on showing how future pieces will fit together. Most modules are placeholders, but a few basic utilities and tests are already implemented.

## Implemented features

The project is mostly scaffolding, but a few pieces are already wired up:

- **Hello World entry point** – `src/index.js` simply prints `"Hello World"` when run.
- **Edge task generation stub** – `generateTasksViaEdge()` in `src/edge/edgeInference.js` returns a sample task list so other modules can be tested.
- **Node test suite** – Tests under `test/` verify the entry point and the edge task generator using Node's built‑in test runner.

Modules for Gmail access, Firestore storage and agent orchestration exist as placeholders and can be expanded later.

## Setup

1. **Install dependencies**
   - Use Node.js **18 or higher** as defined in `package.json`.
   - After cloning the repository run:
     ```bash
     npm install
     ```

2. **Configure environment variables**
   - Copy `.env.sample` to `.env` and fill in the values for your environment.  The `.env` file is ignored by Git and stores credentials such as Gmail OAuth keys, Firestore config and AI API keys.

3. **Run the project**
   - Start the application with Node.js:
     ```bash
     node src/index.js
     ```

4. **Run tests**
   - Execute the test suite with:
     ```bash
     npm test
     ```

## Example commands
```bash
npm install      # install dependencies
node src/index.js    # run the project
npm test         # run the test suite
```

When the Google AI Edge packages become publicly available, add them to
`package.json` and run `npm install` again to install the libraries.

