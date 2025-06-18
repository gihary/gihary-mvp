const path = require('node:path');

require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Check for required environment variables and return those that are missing.
 *
 * Required keys:
 * - FIREBASE_ADMIN_KEY_PATH or (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)
 * - GMAIL_CLIENT_ID
 * - GMAIL_CLIENT_SECRET
 * - GMAIL_REDIRECT_URI
 * - GEMINI_API_KEY
 *
 * @returns {string[]} Array of missing variable names.
 */
function checkEnv() {
  const missing = [];

  if (!process.env.GEMINI_API_KEY) missing.push('GEMINI_API_KEY');
  if (!process.env.GMAIL_CLIENT_ID) missing.push('GMAIL_CLIENT_ID');
  if (!process.env.GMAIL_CLIENT_SECRET) missing.push('GMAIL_CLIENT_SECRET');
  if (!process.env.GMAIL_REDIRECT_URI) missing.push('GMAIL_REDIRECT_URI');

  const hasAdminPath = !!process.env.FIREBASE_ADMIN_KEY_PATH;
  const firebaseVars = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY'];
  const hasFirebaseVars = firebaseVars.every((v) => !!process.env[v]);

  if (!hasAdminPath && !hasFirebaseVars) {
    if (!hasAdminPath) missing.push('FIREBASE_ADMIN_KEY_PATH');
    firebaseVars.forEach((v) => {
      if (!process.env[v]) missing.push(v);
    });
  }

  return missing;
}

if (require.main === module) {
  const missing = checkEnv();
  if (missing.length > 0) {
    console.error('Missing required variables:', missing.join(', '));
    process.exit(1);
  } else {
    console.log('All required environment variables are set.');
  }
}

module.exports = { checkEnv };
