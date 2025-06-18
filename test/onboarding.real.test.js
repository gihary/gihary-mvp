const test = require('node:test');
const assert = require('node:assert');

// This test uses a custom inquirer prompt to simulate user input.
test('startOnboardingWizard uses default prompter', async () => {
  const provided = {
    fullName: 'John Doe',
    company: 'Doe Inc.',
    email: 'john@example.com',
    phone: '123456',
    industry: 'Other',
    goal: 'grow',
    communicationPreference: 'email',
    budget: '<500€',
    digitalMaturity: 4,
    references: 'https://example.com'
  };
  let called = false;

  const fakeInquirer = {
    prompt: async (questions) => {
      called = true;
      assert.ok(Array.isArray(questions));
      return provided;
    },
  };
  fakeInquirer.default = fakeInquirer;

  const inquirerPath = require.resolve('inquirer');
  const originalInquirer = require('inquirer');
  require.cache[inquirerPath] = { exports: fakeInquirer };
  delete require.cache[require.resolve('../src/onboarding')];

  try {
    const { startOnboardingWizard } = require('../src/onboarding');
    const result = await startOnboardingWizard();
    assert.strictEqual(called, true);
    assert.strictEqual(result.fullName, provided.fullName);
    assert.deepStrictEqual(result.references, ['https://example.com']);
  } finally {
    require.cache[inquirerPath] = { exports: originalInquirer };
    delete require.cache[require.resolve('../src/onboarding')];
  }
});
