import nodemailer from "nodemailer";
const email = process.env.EMAIL;
const password = process.env.EMAIL_PASSWORD;
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  secure: true,
  auth: {
    user: email,
    pass: password,
  },

  tls: {
    rejectUnauthorized: false,
  },
  logger: true,
});

export const mailOptions = {
  from: email,
};
