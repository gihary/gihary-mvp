const gmail = require('./gmail');
const { extractTasks } = require('./taskExtractor');
const memory = require('./memory');
const moduloSuggester = require('./moduloSuggester');
const automationPlanner = require('./automationPlanner');

/**
 * Orchestrate processing of emails to tasks and automation plans.
 * Dependencies can be overridden for testing.
 * @param {object} [deps]
 * @returns {Promise<Array>} Array of processed results.
 */
async function orchestrate(deps = {}) {
  const gmailMod = deps.gmail || gmail;
  const extractor = deps.taskExtractor || { extractTasks };
  const memoryMod = deps.memory || memory;
  const suggester = deps.moduloSuggester || moduloSuggester;
  const planner = deps.automationPlanner || automationPlanner;

  const emails = await gmailMod.fetchUnreadEmails();
  const results = [];

  for (const email of emails) {
    const userId = email.userId || 'default';
    await memoryMod.addMessage(userId, 'user', email.text || '');

    const taskData = await extractor.extractTasks(email.text || '', { useEdgeFallback: true });
    const tasks = taskData.tasks || [];

    const suggestions = await suggester.suggestModulesForTasks(tasks);
    const plans = [];
    for (const task of tasks) {
      plans.push(await planner.planAutomation(task));
    }

    results.push({ email, tasks, suggestions, plans });
  }

  return results;
}

module.exports = { orchestrate };
