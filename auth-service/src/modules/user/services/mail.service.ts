import { Transporter } from "nodemailer";
import { InternalServerError } from "../../../middlewares/error-handler";

import { _env } from "../../../config/env";

class MailService {
  constructor(private readonly transporter: Transporter) {}

  async sendEmail(to: string | string[], subject: string, html: string) {
    try {
      const toEmail = Array.isArray(to)
        ? to.map((email) => email.trim())
        : to.trim();
      console.log("Sending email to:", toEmail);
      await this.transporter.sendMail({
        from: `"MVEP" <${_env.SMTP_USER}>`,
        to: toEmail,
        subject,
        html,
      });
      console.log("Email sent successfully");
    } catch (error) {
      console.log(error);
      throw new InternalServerError("Error sending email");
    }
  }
}

export default MailService;
