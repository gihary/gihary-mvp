// Firestore storage implementation using firebase-admin.
// The admin SDK is lazily initialized so unit tests can supply a mock
// Firestore instance.

const admin = require('firebase-admin');

let firestore;

function getFirestore() {
  if (firestore) {
    return firestore;
  }
  if (!admin.apps.length) {
    // Initialize with default credentials. In production environments the
    // GOOGLE_APPLICATION_CREDENTIALS environment variable should point to a
    // service account JSON file.
    admin.initializeApp();
  }
  firestore = admin.firestore();
  return firestore;
}

// Allow tests to inject a mock Firestore instance.
function _setFirestore(db) {
  firestore = db;
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
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Save a conversation for a user.
 * @param {string} userId
 * @param {object} convo
 * @returns {Promise<void>}
 */
async function saveConversation(userId, convo) {
  const db = getFirestore();
  await db.collection('users').doc(userId).collection('conversations').add(convo);
}

/**
 * List conversations for a user.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
async function listConversations(userId) {
  const db = getFirestore();
  const snapshot = await db.collection('users').doc(userId).collection('conversations').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

module.exports = {
  saveTask,
  listTasks,
  saveConversation,
  listConversations,
  _setFirestore,
};
