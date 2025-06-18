const test = require('node:test');
const assert = require('node:assert');
const { startOnboardingWizard } = require('../src/onboarding');

test('startOnboardingWizard returns answers object', async () => {
  const stub = {
    prompt: async () => ({
      fullName: 'Mario Rossi',
      company: 'Rossi SRL',
      email: 'mario@example.com',
      phone: '123',
      industry: 'eCommerce',
      goal: 'increase sales',
      communicationPreference: 'email',
      budget: '500-2000€',
      digitalMaturity: 3,
      references: 'https://example.com',
    }),
  };
  const result = await startOnboardingWizard(stub);
  assert.strictEqual(result.fullName, 'Mario Rossi');
  assert.deepStrictEqual(result.references, ['https://example.com']);
});
