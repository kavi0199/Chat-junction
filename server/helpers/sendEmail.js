const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // ya outlook, yahoo (jo use karte ho)
      auth: {
        user: process.env.EMAIL_USER, // tumhara email
        pass: process.env.EMAIL_PASS, // tumhara app password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
    });

    console.log("Email sent to:", to);
  } catch (error) {
    console.log("Email error:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;