const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendVerificationEmail = async (to, token, subject = '', customHtml = '') => {
  let html = customHtml;
  if (!customHtml) {
    const link = `${process.env.FRONTEND_URL}/verify?token=${token}`;
    html = `
      <h2>¡Bienvenido a Seneca!</h2>
      <p>Gracias por registrarte. Para activar tu cuenta, haz clic en el siguiente enlace:</p>
      <a href="${link}" target="_blank">Activar cuenta</a>
      <p>Este enlace expirará en 10 minutos.</p>
    `;
    subject = 'Verifica tu cuenta en Seneca';
  }

  await transporter.sendMail({
    from: `"Seneca App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log('Email sent successfully');
};

module.exports = { sendVerificationEmail };
