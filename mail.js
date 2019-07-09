const nodemailer = require('nodemailer');

const smtpTransport = nodemailer.createTransport('SMTP', {
  service: 'Gmail',
  auth: {
    user: 'user@gmail.com',
    pass: '******',
  },
});

smtpTransport.sendMail({
  from: 'Vasiliy Pupkin <user@gmail.com>',
  to: 'petya@pupkin.ru, kolya@pupkin.ru',
  subject: 'Семейное торжество Пупкиных',
  html: `<b>Дорогие братья Пупкины</b>!<br/>Приглашаю вас на юбилей`,
}, (err, response) => {
  if(err) {
    throw err;
  }

  console.log('Message has been sent', response.message);

  smtpTransport.close();
});