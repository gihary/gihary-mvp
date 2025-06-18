// Simple in-memory conversational memory
const conversations = {};

/**
 * Add a message for a user.
 * @param {string} userId
 * @param {string} role
 * @param {string} content
 */
async function addMessage(userId, role, content) {
  if (!conversations[userId]) {
    conversations[userId] = [];
  }
  conversations[userId].push({ role, content });
}

/**
 * Get conversation history for a user.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
async function getMessages(userId) {
  return conversations[userId] ? [...conversations[userId]] : [];
}

/**
 * Clear the conversation memory for a user.
 * @param {string} userId
 */
async function clear(userId) {
  conversations[userId] = [];
}

module.exports = {
  addMessage,
  getMessages,
  clear,
};
