const minimist = require('minimist');

const argv = minimist(process.argv.slice(2), {
  alias: {
    help: 'h',
  }
});

if(argv.help) {
  console.log('Справка по приложению');
}