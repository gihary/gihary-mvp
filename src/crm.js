const { getFirestore } = require('./firestore');

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
  const docRef = db.collection('clients').doc(userId).collection('profile').doc('profile');
  await docRef.set(payload);
  return payload;
}

module.exports = { saveClientProfile };
