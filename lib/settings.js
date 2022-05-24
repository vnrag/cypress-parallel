const yargs = require('yargs');

const argv = yargs
  .option('script', {
    alias: 's',
    type: 'string',
    description: 'Your npm Cypress command'
  })
  .option('threads', {
    alias: 't',
    type: 'number',
    description: 'Number of threads'
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Execute with verbose logging'
  })
  .option('bail', {
    alias: 'b',
    type: 'boolean',
    description: 'Exit on first suite finishing with errors'
  })
  .option('specsDir', {
    alias: 'd',
    type: 'string',
    description: 'Cypress specs directory'
  })
  .option('args', {
    alias: 'a',
    type: 'string',
    description: 'Your npm Cypress command arguments'
  })
  .option('reporter', {
    alias: 'r',
    type: 'string',
    description: 'Reporter to pass to Cypress'
  })
  .option('reporterModulePath', {
    alias: 'n',
    type: 'string',
    description: 'Reporter module path'
  })
  .option('reporterOptions', {
    alias: 'o',
    type: 'string',
    description: 'Reporter options'
  })
  .option('reporterOptionsPath', {
    alias: 'p',
    type: 'string',
    description: 'Reporter options path'
  })
  .option('strictMode', {
    alias: 'm',
    type: 'boolean',
    default: true,
    description: 'Strict mode checks'
  })
  .option('weightsJSON', {
    alias: 'w',
    type: 'string',
    description: 'Location of the weights.json file'
  })
  .option('resultsPath', {
    alias: 'rp',
    type: 'string',
    description: 'Path where cypress results will be located'
  }).argv;

if (!argv.script) {
  throw new Error('Expected command, e.g.: cypress-parallel <cypress-script>');
}

const COLORS = [
  '\x1b[32m',
  '\x1b[36m',
  '\x1b[29m',
  '\x1b[33m',
  '\x1b[37m',
  '\x1b[38m',
  '\x1b[39m',
  '\x1b[40m'
];

const settings = {
  threadCount: argv.threads ? argv.threads : 2,
  testSuitesPath: argv.specsDir ? argv.specsDir : 'cypress/integration',
  shouldBail: argv.bail ? argv.bail : false,
  isVerbose: argv.verbose ? argv.verbose : false,
  weightsJSON: argv.weightsJSON ? argv.weightsJSON : 'cypress/parallel-weights.json',
  defaultWeight: 1,
  reporter: argv.reporter,
  reporterModulePath: argv.reporterModulePath
    ? argv.reporterModulePath
    : 'cypress-multi-reporters',
  reporterOptions: argv.reporterOptions,
  reporterOptionsPath: argv.reporterOptionsPath,
  script: argv.script,
  strictMode: argv.strictMode,
  scriptArguments: argv.args ? argv.args.split(' ') : [],
  resultsPath: argv.resultsPath ? argv.resultsPath : 'runner-results',
};

process.env.CY_PARALLEL_SETTINGS = JSON.stringify(settings);

module.exports = {
  settings,
  COLORS
};
