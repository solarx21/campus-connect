"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMutualAdmireNotification = exports.sendAdmireNotification = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const sendVerificationEmail = async (email, token) => {
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
exports.sendVerificationEmail = sendVerificationEmail;
const sendAdmireNotification = async (email) => {
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
exports.sendAdmireNotification = sendAdmireNotification;
const sendMutualAdmireNotification = async (email, admirerName) => {
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
exports.sendMutualAdmireNotification = sendMutualAdmireNotification;
