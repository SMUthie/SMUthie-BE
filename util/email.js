const nodemailer = require('nodemailer');

const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const ADMIN_EMAIL_SETTING = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'smuroom@gmail.com',
    pass: SMTP_PASSWORD,
  },
};

//학번+제목+이메일의 HTML내용으로 이메일을 보낸다.
exports.sendEmailUseSchoolId = (school_id, subject, htmlContent) => {
  const emailTo = school_id + '@sangmyung.kr';
  try {
    const transporter = nodemailer.createTransport(ADMIN_EMAIL_SETTING);
    transporter.sendMail(
      {
        from: 'smuroom@gmail.comr',
        to: emailTo,
        subject: subject,
        html: htmlContent,
      },
      (error, info) => {
        if (error) {
          throw new Error('Send Email Callback Error: ' + error);
        }
      }
    );
  } catch (error) {
    console.error('Send Email Error: ' + error);
  }
};
