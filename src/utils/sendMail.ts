import nodemailer from "nodemailer";

const sendMail = async (options: any) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  } as nodemailer.TransportOptions);

  const mailOptions = {
    from: `${process.env.App_NAME} <${process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `<div style="background-color: #f1f1f1; padding: 2%; margin: 2%;"><h1 dir="rtl">${options.message}</h1><h2 dir="rtl">${options.message}</h2></div>`,
  };

  await transporter.sendMail(mailOptions);
};
export default sendMail;
