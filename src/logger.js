const { getFirestore } = require('./firestore');

/**
 * Log an event for a user in Firestore under logs/{userId}/events.
 *
 * @param {string} userId - User identifier.
 * @param {string} action - Event action name.
 * @param {object} [metadata] - Additional event data.
 * @returns {Promise<object>} The stored payload.
 */
async function logEvent(userId, action, metadata = {}) {
  if (!userId) throw new Error('userId is required');
  if (!action) throw new Error('action is required');
  const db = getFirestore();
  const payload = {
    action,
    metadata,
    timestamp: Date.now(),
  };
  await db
    .collection('logs')
    .doc(userId)
    .collection('events')
    .add(payload);
  return payload;
}

module.exports = { logEvent };
