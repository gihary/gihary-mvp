const test = require('node:test');
const assert = require('node:assert');
const { generateTasksViaEdge } = require('../src/edge/edgeInference');

test('generateTasksViaEdge returns proper JSON structure', async () => {
  const result = await generateTasksViaEdge('Email content');
  assert.ok(result);
  assert.strictEqual(result.source, 'edge');
  assert.ok(Array.isArray(result.tasks));
  assert.ok(result.tasks.length > 0);
  const task = result.tasks[0];
  assert.strictEqual(typeof task.title, 'string');
  assert.strictEqual(typeof task.description, 'string');
});
