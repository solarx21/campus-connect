import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your Campus Connect account',
    html: `
      <h2>Welcome to Campus Connect!</h2>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const sendAdmireNotification = async (email: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Someone admires you on Campus Connect! 😉',
    html: `
      <h2>You have a secret admirer!</h2>
      <p>Someone on Campus Connect thinks you're cool and admires you.</p>
      <p>Check your app to see if it's a mutual match!</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const sendMutualAdmireNotification = async (email: string, admirerName: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Mutual Admiration Match! 💕',
    html: `
      <h2>Congratulations!</h2>
      <p>You and ${admirerName} both admire each other!</p>
      <p>Time to connect and make some awesome memories together! 🎉</p>
    `
  };

  await transporter.sendMail(mailOptions);
};