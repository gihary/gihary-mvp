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
    const {
      FIREBASE_ADMIN_KEY_PATH,
      FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY,
    } = process.env;

    if (FIREBASE_ADMIN_KEY_PATH) {
      const serviceAccount = require(FIREBASE_ADMIN_KEY_PATH);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_CLIENT_EMAIL,
          privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      throw new Error(
        'Firestore credentials are missing. Set FIREBASE_ADMIN_KEY_PATH or service account variables.',
      );
    }
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
