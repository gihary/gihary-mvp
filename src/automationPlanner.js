const { callGemini } = require('./moduloSuggester');

/**
 * Plan steps to automate a given task using Gemini.
 * @param {object} task
 * @returns {Promise<string>}
 */
async function planAutomation(task) {
  const prompt = `Provide an automation plan for the following task: ${JSON.stringify(task)}`;
  return callGemini(prompt);
}

module.exports = {
  planAutomation,
};
