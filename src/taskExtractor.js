const { generateTasksViaEdge } = require('./edge/edgeInference');

/**
 * Extract tasks from an email. This attempts to use Genkit first and falls back
 * to google-ai-edge if requested.
 * @param {string} emailText
 * @param {object} [opts]
 * @param {boolean} [opts.useEdgeFallback] - When true, call google-ai-edge as a fallback.
 */
async function extractTasks(emailText, opts = {}) {
  const { useEdgeFallback = false } = opts;
  try {
    // Placeholder for Genkit-based extraction (not implemented)
    throw new Error('Genkit not implemented');
  } catch (err) {
    if (useEdgeFallback) {
      return generateTasksViaEdge(emailText);
    }
    throw err;
  }
}

module.exports = { extractTasks };
