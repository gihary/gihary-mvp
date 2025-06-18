// Minimal Gmail API integration used by the project.
// This module exposes helpers to authenticate with OAuth2 and
// fetch unread messages from the Gmail API.

const { google } = require('googleapis');

/**
 * Create an OAuth2 client using environment variables.
 *
 * Required environment variables:
 * - GMAIL_CLIENT_ID
 * - GMAIL_CLIENT_SECRET
 * - GMAIL_REDIRECT_URI
 * - (optional) GMAIL_REFRESH_TOKEN
 *
 * @returns {OAuth2Client}
 */
function getOAuth2Client() {
  const {
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    GMAIL_REDIRECT_URI,
    GMAIL_REFRESH_TOKEN,
  } = process.env;

  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REDIRECT_URI) {
    throw new Error('Missing Gmail OAuth environment variables');
  }

  const oauth2Client = new google.auth.OAuth2(
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    GMAIL_REDIRECT_URI,
  );

  if (GMAIL_REFRESH_TOKEN) {
    oauth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });
  }

  return oauth2Client;
}

/**
 * Create a Gmail API client for the authenticated user.
 * @param {OAuth2Client} [auth] - Optional OAuth2 client; if omitted one is created.
 * @returns {gmail_v1.Gmail}
 */
function createGmailClient(auth = getOAuth2Client()) {
  return google.gmail({ version: 'v1', auth });
}

/**
 * Fetch unread emails for the application user.
 *
 * @param {gmail_v1.Gmail} [gmail] - Optional Gmail client to use (mainly for testing).
 * @returns {Promise<Array>} Resolves with an array of email objects.
 */
async function fetchUnreadEmails(gmail = createGmailClient()) {
  try {
    const listRes = await gmail.users.messages.list({
      userId: 'me',
      q: 'is:unread',
    });

    const messages = listRes.data.messages || [];

    const fullMessages = await Promise.all(
      messages.map((m) =>
        gmail.users.messages.get({
          userId: 'me',
          id: m.id,
          format: 'full',
        }),
      ),
    );

    return fullMessages.map((m) => m.data);
  } catch (err) {
    // Wrap errors with a more user friendly message.
    throw new Error(`Failed to fetch emails: ${err.message}`);
  }
}

module.exports = { getOAuth2Client, createGmailClient, fetchUnreadEmails };
