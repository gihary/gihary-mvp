// Basic Firestore helper used across modules
// Requires GOOGLE_APPLICATION_CREDENTIALS to be set for authentication

const { Firestore } = require('@google-cloud/firestore');

let firestore;

function getFirestore() {
  if (!firestore) {
    firestore = new Firestore();
  }
  return firestore;
}

/**
 * Save a task for a user.
 * @param {string} userId
 * @param {object} task
 * @returns {Promise<void>}
 */
async function saveTask(userId, task) {
  const db = getFirestore();
  await db.collection('users').doc(userId).collection('tasks').add(task);
}

/**
 * List tasks for a user.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
async function listTasks(userId) {
  const db = getFirestore();
  const snapshot = await db.collection('users').doc(userId).collection('tasks').get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

module.exports = { getFirestore, saveTask, listTasks };
