const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

/**
 * Call the Gemini API with a prompt. If GEMINI_API_KEY is not set, return
 * a placeholder string.
 * @param {string} prompt
 * @returns {Promise<string>}
 */
async function callGemini(prompt) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return `Sample suggestion for: ${prompt}`;
  }

  const url = `${GEMINI_URL}?key=${key}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        { parts: [ { text: prompt } ] }
      ]
    })
  });

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return text || '';
}

/**
 * Suggest automation modules for a list of tasks.
 * @param {Array} tasks
 * @returns {Promise<string>}
 */
async function suggestModulesForTasks(tasks) {
  const prompt = `Suggest automation modules for these tasks: ${JSON.stringify(tasks)}`;
  return callGemini(prompt);
}

module.exports = {
  callGemini,
  suggestModulesForTasks,
};
