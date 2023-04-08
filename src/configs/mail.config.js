import nodemailer from "nodemailer";

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.SECRET_KEY_EMAIL,
  },
});

export default mailTransporter;
