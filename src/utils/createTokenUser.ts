import { IUser } from '../models/Users'

const createTokenUser = (user: IUser) => {
  return { userId: user._id, name: user.name, role: user.role }
}

export default createTokenUser
