import { user } from '../models/Users'

const createTokenUser = (user: user) => {
  return { userId: user._id, name: user.name, role: user.role }
}

export default createTokenUser
