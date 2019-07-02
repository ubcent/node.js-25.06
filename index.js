const ansi = require('ansi');

const cursor = ansi(process.stdout);

cursor
  .red()
  .bg.blue()
  .write('Hi there!')
  .bg.reset()
  .reset()
  .write('\n');

cursor.beep();