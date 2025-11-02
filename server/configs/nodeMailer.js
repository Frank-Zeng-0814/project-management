import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({to, subject, body}) => {
    const sendEmail = await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    text: body,
    })
    return sendEmail;
}

export default sendEmail;
