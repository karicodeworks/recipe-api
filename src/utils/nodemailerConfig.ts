export const mailConfig = {
  service: 'Gmail',
  auth: {
    user: process.env.MY_EMAIL, // Add your username here
    pass: process.env.APP_PASSWORD, // Add your password here
  },
}
