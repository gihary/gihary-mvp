require('dotenv').config();
const { startOnboardingWizard } = require('./onboarding');
const { saveClientProfile } = require('./crm');

async function main() {
  if (process.env.SKIP_ONBOARDING === '1') {
    console.log('Hello World');
    return;
  }
  const data = await startOnboardingWizard();
  await saveClientProfile(data);
  console.log('Profile saved');
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { main };
