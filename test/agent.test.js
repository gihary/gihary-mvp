const test = require('node:test');
const assert = require('node:assert');
const { orchestrate } = require('../src/agent');

test('orchestrate processes emails through pipeline', async () => {
  const fakeGmail = {
    fetchUnreadEmails: async () => [{ userId: 'u', text: 'email content' }],
  };
  const fakeExtractor = {
    extractTasks: async () => ({ tasks: [{ title: 'T', description: 'd' }] }),
  };
  const stored = [];
  const fakeMemory = {
    addMessage: async (u, r, c) => stored.push({ u, r, c }),
  };
  const fakeSuggester = {
    suggestModulesForTasks: async () => 'modules',
  };
  const fakePlanner = {
    planAutomation: async () => 'plan',
  };

  const results = await orchestrate({
    gmail: fakeGmail,
    taskExtractor: fakeExtractor,
    memory: fakeMemory,
    moduloSuggester: fakeSuggester,
    automationPlanner: fakePlanner,
  });

  assert.strictEqual(stored.length, 1);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].suggestions, 'modules');
  assert.deepStrictEqual(results[0].plans, ['plan']);
});
