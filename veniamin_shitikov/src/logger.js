const path = require('path');
const fs = require('fs');
const os = require('os');

const logFile = path.resolve(__dirname, 'game.log');
const newLine = os.EOL;

module.exports = (user, result) => {
  const message = `${newLine}${user}:${+result}`;

  fs.appendFile(logFile, message, (err) => {
    if (err) console.error(err);
  })
}