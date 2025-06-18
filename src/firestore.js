// Lightweight Firestore helper. This tries to use the
// @google-cloud/firestore package if credentials are available.
// When Firestore is not configured the functions simply log and
// resolve without error so the rest of the application can run in
// local test environments.

let firestore;
try {
  const { Firestore } = require('@google-cloud/firestore');
  firestore = new Firestore();
} catch (err) {
  console.warn('Firestore not initialized:', err.message);
}

/**
 * Save a task for a user.
 * @param {string} userId
 * @param {object} task
 * @returns {Promise<void>}
 */
async function saveTask(userId, task) {
  if (!firestore) {
    console.warn('saveTask called without Firestore configured');
    return;
  }
  const ref = firestore.collection('users').doc(userId).collection('tasks');
  await ref.add(task);
}

/**
 * List tasks for a user.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
async function listTasks(userId) {
  if (!firestore) {
    console.warn('listTasks called without Firestore configured');
    return [];
  }
  const snapshot = await firestore
    .collection('users')
    .doc(userId)
    .collection('tasks')
    .get();
  return snapshot.docs.map((d) => d.data());
}

/**
 * Save or update a user profile.
 * The document id is the user's email for simplicity.
 * @param {object} profile
 * @param {string} profile.email
 * @returns {Promise<void>}
 */
async function saveUserProfile(profile) {
  if (!firestore) {
    console.warn('saveUserProfile called without Firestore configured');
    return;
  }
  const { email, ...rest } = profile;
  await firestore.collection('users').doc(email).set({ email, ...rest }, { merge: true });
}

module.exports = { saveTask, listTasks, saveUserProfile };
