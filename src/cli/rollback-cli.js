require('dotenv').config();
const { rollbackClientProfile } = require('../rollback');

async function main() {
  const arg = process.argv.find((a) => a.startsWith('--email='));
  if (!arg) {
    console.error('Usage: npm run rollback -- --email=<address>');
    process.exit(1);
  }
  const email = arg.split('=')[1];
  try {
    await rollbackClientProfile(email);
    console.log('Profile restored from backup');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
