const test = require('node:test');
const assert = require('node:assert');

// Helper to replace the edge inference module with a stub
function withEdgeStub(stub, fn) {
  const edgePath = require.resolve('../src/edge/edgeInference');
  const original = require(edgePath);
  require.cache[edgePath] = { exports: stub };
  // Clear the taskExtractor module so it picks up the stub
  delete require.cache[require.resolve('../src/taskExtractor')];
  return fn().finally(() => {
    require.cache[edgePath] = { exports: original };
    delete require.cache[require.resolve('../src/taskExtractor')];
  });
}

test('extractTasks uses Edge fallback when enabled', async () => {
  const stub = {
    generateTasksViaEdge: async (text) => ({
      source: 'edge',
      tasks: [{ title: 'Stub Task', description: `stub: ${text}` }],
    }),
  };

  await withEdgeStub(stub, async () => {
    const { extractTasks } = require('../src/taskExtractor');
    const result = await extractTasks('hello', { useEdgeFallback: true });
    assert.strictEqual(result.source, 'edge');
    assert.deepStrictEqual(result.tasks, [
      { title: 'Stub Task', description: 'stub: hello' },
    ]);
  });
});

test('extractTasks throws when fallback disabled', async () => {
  let called = false;
  const stub = {
    generateTasksViaEdge: async () => {
      called = true;
      return { source: 'edge', tasks: [] };
    },
  };

  await withEdgeStub(stub, async () => {
    const { extractTasks } = require('../src/taskExtractor');
    await assert.rejects(
      extractTasks('email text'),
      /Genkit not implemented/,
    );
    assert.strictEqual(called, false);
  });
});
