import nodemailer from "nodemailer"
import { mailConfig } from "./nodemailerConfig"

interface SendEmailType {
  to: string
  subject: string
  html: string
}

const sendEmail = ({ to, subject, html }: SendEmailType) => {
  const transporter = nodemailer.createTransport(mailConfig)

  return transporter.sendMail({
    from: `"Recipe App" <${process.env.MY_EMAIL}>`,
    to,
    subject,
    html,
  })
}

export default sendEmail
