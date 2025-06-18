const test = require('node:test');
const assert = require('node:assert');
const { fetchUnreadEmails } = require('../src/gmail');

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
