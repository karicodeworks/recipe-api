import nodemailer from 'nodemailer'
import { mailConfig } from './nodemailerConfig'

interface VerificationType {
  name: string
  email: string
  verificationToken: string
  origin: any
}

interface SendEmailType {
  to: string
  subject: string
  html: string
}

const sendVerificationEmail = ({
  name,
  email,
  verificationToken,
  origin,
}: VerificationType) => {
  const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`

  sendEmail({
    to: email,
    subject: 'Verify Acount',
    html: `
    <h1>Niaje, ${name}</h1>
    <p>Thank you for signing up. Please click the link below to verify your email:</p>
    <a href="${verifyEmail}">Click Here</a>
    `,
  })
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

export default sendVerificationEmail
