const gmail = require('./gmail');
const llm = require('./llm');
const firestore = require('./firestore');

async function authenticate() {
  return gmail.authenticate();
}

async function processEmails() {
  const authToken = await gmail.authenticate();
  const messages = await gmail.fetchMessages(authToken);
  const tasks = [];
  for (const msg of messages) {
    const extracted = await llm.extractTasksFromEmail(msg);
    tasks.push(...extracted);
  }
  await firestore.saveTasks(tasks);
  return tasks;
}

module.exports = {
  authenticate,
  processEmails
};
