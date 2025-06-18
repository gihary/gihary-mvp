const test = require('node:test');
const assert = require('node:assert');
const { fetchUnreadEmails, getOAuth2Client } = require('../src/gmail');

// Mock Gmail API methods
function createStubGmail({ listError } = {}) {
  return {
    users: {
      messages: {
        list: async () => {
          if (listError) throw new Error('boom');
          return { data: { messages: [{ id: '1' }] } };
        },
        get: async ({ id }) => ({ data: { id, snippet: 'msg' } }),
      },
    },
  };
}

test('getOAuth2Client returns client when vars are set', () => {
  process.env.GMAIL_CLIENT_ID = 'id';
  process.env.GMAIL_CLIENT_SECRET = 'secret';
  process.env.GMAIL_REDIRECT_URI = 'uri';

  const client = getOAuth2Client();
  assert.ok(client);
});

test('getOAuth2Client errors for missing GMAIL_CLIENT_ID', () => {
  delete process.env.GMAIL_CLIENT_ID;
  process.env.GMAIL_CLIENT_SECRET = 'secret';
  process.env.GMAIL_REDIRECT_URI = 'uri';

  assert.throws(() => getOAuth2Client(), /GMAIL_CLIENT_ID/);
});

test('getOAuth2Client errors for multiple missing vars', () => {
  delete process.env.GMAIL_CLIENT_ID;
  delete process.env.GMAIL_CLIENT_SECRET;
  process.env.GMAIL_REDIRECT_URI = 'uri';

  assert.throws(
    () => getOAuth2Client(),
    /GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET/
  );
});

test('fetchUnreadEmails returns messages', async () => {
  const emails = await fetchUnreadEmails(createStubGmail());
  assert.strictEqual(emails.length, 1);
  assert.strictEqual(emails[0].id, '1');
});

test('fetchUnreadEmails wraps API errors', async () => {
  await assert.rejects(
    fetchUnreadEmails(createStubGmail({ listError: true })),
    /Failed to fetch emails/,
  );
});
