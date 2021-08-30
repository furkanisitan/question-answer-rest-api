const nodemailer = require("nodemailer");

const sendEmail = async (mailOptions) => {

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_SERVER_HOST,
        port: process.env.SMTP_SERVER_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASS
        }
    });

    await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
