const { getFirestore } = require('./firestore');

/**
 * Restore the latest profile backup for a client.
 * Backup document must exist at clients/{email}/backup/profile.
 *
 * @param {string} email - Client email identifier.
 * @returns {Promise<object>} Restored profile data.
 */
async function rollbackClientProfile(email) {
  if (!email) throw new Error('email is required');
  const db = getFirestore();

  const backupRef = db
    .collection('clients')
    .doc(email)
    .collection('backup')
    .doc('profile');

  const snap = await backupRef.get();
  if (!snap.exists) throw new Error('No backup found');
  const data = snap.data();

  const profileRef = db
    .collection('clients')
    .doc(email)
    .collection('profile')
    .doc('profile');
  await profileRef.set(data);
  return data;
}

module.exports = { rollbackClientProfile };
