const https = require('https');

https.get('https://geekbrains.ru', (res) => {
  console.log('Got response:', res.statusCode);
}).on('error', (error) => {
  console.error('Got error:', error);
});