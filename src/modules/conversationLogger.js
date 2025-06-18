const { getFirestore } = require('../firestore');

function conversationsCollection() {
  return getFirestore().collection('conversations');
}

async function logEmail(userId, email) {
  await conversationsCollection().add({
    type: 'email',
    userId,
    timestamp: Date.now(),
    ...email,
  });
}

async function logWhatsApp(userId, message) {
  await conversationsCollection().add({
    type: 'whatsapp',
    userId,
    timestamp: Date.now(),
    ...message,
  });
}

module.exports = { logEmail, logWhatsApp };
