const defaultPrompter = require('inquirer').default || require('inquirer');

async function startOnboardingWizard(prompter = defaultPrompter) {
  const questions = [
    { name: 'fullName', message: 'Full name', type: 'input' },
    { name: 'company', message: 'Company/Brand (optional)', type: 'input' },
    { name: 'email', message: 'Primary email', type: 'input' },
    { name: 'phone', message: 'Primary phone (WhatsApp)', type: 'input' },
    {
      name: 'industry',
      message: 'Industry',
      type: 'list',
      choices: ['eCommerce', 'SaaS', 'Retail', 'Manufacturing', 'Other'],
    },
    { name: 'goal', message: 'Primary goal with Gihary', type: 'input' },
    {
      name: 'communicationPreference',
      message: 'Preferred communication',
      type: 'list',
      choices: ['email', 'whatsapp', 'both'],
    },
    {
      name: 'budget',
      message: 'Available budget',
      type: 'list',
      choices: ['<500€', '500-2000€', '2000-5000€', '>5000€'],
    },
    {
      name: 'digitalMaturity',
      message: 'Digital maturity (1-5)',
      type: 'number',
      validate: (n) => n >= 1 && n <= 5 || 'Enter a value between 1 and 5',
    },
    {
      name: 'references',
      message: 'Important links (comma separated)',
      type: 'input',
    },
  ];

  const answers = await prompter.prompt(questions);

  answers.references = answers.references
    ? answers.references.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  return answers;
}

module.exports = { startOnboardingWizard };
