import mailTransporter from "../configs/mail.config.js";
import { InternalServerError } from "../core/error.response.js";

const sendEmail = ({ email, content, subject }) => {
  let config = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    html: content,
  };

  mailTransporter.sendMail(config, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      throw new InternalServerError("Mail Error!");
    }
  });
};

export default sendEmail;
