const nodemailer = require("nodemailer");

class EmailService {

    constructor() {

        this.transporter = nodemailer.createTransport({

            host: process.env.EMAIL_HOST,

            port: Number(process.env.EMAIL_PORT),

            secure: true,

            auth: {

                user: process.env.EMAIL_USER,

                pass: process.env.EMAIL_PASS,

            },

        });

    }

    async sendMail({

        to,

        subject,

        html,

    }) {

        await this.transporter.sendMail({

            from: `"PawPoint" <${process.env.EMAIL_USER}>`,

            to,

            subject,

            html,

        });

    }

}

module.exports = new EmailService();