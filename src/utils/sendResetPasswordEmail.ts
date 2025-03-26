import sendEmail from "./sendEmail"

interface passwordResetType {
  name: string
  email: string
  token: string
  origin: any
}

const sendResetPasswordEmail = ({
  name,
  email,
  token,
  origin,
}: passwordResetType) => {
  const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`

  sendEmail({
    to: email,
    subject: "Password Reset",
    html: `
        <h1>Niaje, ${name}</h1>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetURL}">Click Here</a>
        `,
  })
}

export default sendResetPasswordEmail
