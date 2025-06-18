const { getFirestore } = require('./firestore');
const { logEvent } = require('./logger');

async function saveClientProfile(data) {
  const db = getFirestore();
  const userId = data.userId || data.email;
  if (!userId) {
    throw new Error('userId or email required');
  }
  const payload = {
    ...data,
    createdAt: Date.now(),
    source: 'onboarding-wizard',
  };
  const clientRef = db.collection('clients').doc(userId);
  const profileRef = clientRef.collection('profile').doc('profile');

  const snap = await profileRef.get();
  if (snap.exists) {
    const backupRef = clientRef.collection('backup').doc('profile');
    await backupRef.set(snap.data());
  }

  await profileRef.set(payload);
  await logEvent(userId, 'profile_saved');
  return payload;
}

module.exports = { saveClientProfile };
