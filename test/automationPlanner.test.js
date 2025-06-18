const test = require('node:test');
const assert = require('node:assert');
const { planAutomation } = require('../src/automationPlanner');

test('planAutomation returns stub without API key', async () => {
  delete process.env.GEMINI_API_KEY;
  const result = await planAutomation({ title: 'Task', description: 'desc' });
  assert.ok(result.includes('Sample suggestion'));
});
