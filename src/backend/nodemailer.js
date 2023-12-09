const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    user: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: 'login',
      user: 'automaticoh@gmail.com',
      pass: 'ubga ssvm zwww gref'
    }
  });

module.exports = transporter;