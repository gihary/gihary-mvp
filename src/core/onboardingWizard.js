const readline = require('node:readline');
const { saveUserProfile } = require('../firestore');

/**
 * Run a simple CLI onboarding flow to collect user information
 * and persist it to Firestore.
 * @returns {Promise<object>} The saved profile
 */
async function runOnboarding() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const ask = (q) => new Promise((resolve) => rl.question(q, resolve));
  const name = await ask('Enter your name: ');
  const email = await ask('Enter your email: ');
  rl.close();

  const profile = { name, email, createdAt: new Date().toISOString() };
  await saveUserProfile(profile);
  console.log('Profile saved');
  return profile;
}

module.exports = { runOnboarding };
