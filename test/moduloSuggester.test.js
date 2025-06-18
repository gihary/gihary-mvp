const test = require('node:test');
const assert = require('node:assert');
const { suggestModulesForTasks } = require('../src/moduloSuggester');

test('suggestModulesForTasks returns stub without API key', async () => {
  delete process.env.GEMINI_API_KEY;
  const result = await suggestModulesForTasks([{ title: 'Task' }]);
  assert.ok(result.includes('Sample suggestion'));
});
