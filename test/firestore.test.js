const test = require('node:test');
const assert = require('node:assert');
const { saveTask, listTasks, saveConversation, listConversations, _setFirestore } = require('../src/firestore');

function createMockFirestore() {
  const store = { tasks: {}, convos: {} };
  return {
    collection(name) {
      if (name !== 'users') throw new Error('only users supported');
      return {
        doc(userId) {
          return {
            collection(sub) {
              if (sub === 'tasks') {
                return {
                  async add(data) {
                    const arr = store.tasks[userId] || (store.tasks[userId] = []);
                    const id = String(arr.length);
                    arr.push({ id, data });
                    return { id };
                  },
                  async get() {
                    const arr = store.tasks[userId] || [];
                    return {
                      docs: arr.map(t => ({ id: t.id, data: () => t.data }))
                    };
                  }
                };
              }
              if (sub === 'conversations') {
                return {
                  async add(data) {
                    const arr = store.convos[userId] || (store.convos[userId] = []);
                    const id = String(arr.length);
                    arr.push({ id, data });
                    return { id };
                  },
                  async get() {
                    const arr = store.convos[userId] || [];
                    return {
                      docs: arr.map(c => ({ id: c.id, data: () => c.data }))
                    };
                  }
                };
              }
              throw new Error('unknown subcollection');
            }
          };
        }
      };
    }
  };
}

test('saveTask and listTasks using mock Firestore', async () => {
  const mock = createMockFirestore();
  _setFirestore(mock);
  const uid = 'user1';
  await saveTask(uid, { title: 'A' });
  await saveTask(uid, { title: 'B' });
  const tasks = await listTasks(uid);
  assert.strictEqual(tasks.length, 2);
  assert.strictEqual(tasks[0].title, 'A');
  assert.strictEqual(tasks[1].title, 'B');
});

test('saveConversation and listConversations using mock Firestore', async () => {
  const mock = createMockFirestore();
  _setFirestore(mock);
  const uid = 'user1';
  await saveConversation(uid, { text: 'hi' });
  await saveConversation(uid, { text: 'there' });
  const convos = await listConversations(uid);
  assert.strictEqual(convos.length, 2);
  assert.strictEqual(convos[0].text, 'hi');
  assert.strictEqual(convos[1].text, 'there');
});
