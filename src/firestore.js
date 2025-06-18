// Basic Firestore storage helpers implemented with firebase-admin

const admin = require('firebase-admin');

let firestore;

/**
 * Override the Firestore instance used by this module. Mainly for testing.
 * @param {object} db
 */
function setFirestore(db) {
  firestore = db;
}

function getFirestore() {
  if (firestore) return firestore;

  if (!admin.apps.length) {
    const { FIREBASE_ADMIN_KEY_PATH } = process.env;
    if (!FIREBASE_ADMIN_KEY_PATH) {
      throw new Error('FIREBASE_ADMIN_KEY_PATH environment variable is required');
    }
    const serviceAccount = require(FIREBASE_ADMIN_KEY_PATH);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  firestore = admin.firestore();
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
  const snap = await db.collection('users').doc(userId).collection('tasks').get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

module.exports = { saveTask, listTasks, getFirestore, setFirestore };
