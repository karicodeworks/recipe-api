import sendEmail from "./sendEmail"

interface VerificationType {
  name: string
  email: string
  verificationToken: string
  origin: any
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
    subject: "Verify Acount",
    html: `
    <h1>Niaje, ${name}</h1>
    <p>Thank you for signing up. Please click the link below to verify your email:</p>
    <a href="${verifyEmail}">Click Here</a>
    `,
  })
}

export default sendVerificationEmail
