import mongoose from 'mongoose'
import validator from 'validator'
import bcryptjs from 'bcryptjs'

export interface user extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId
  name: string
  password: string
  email: string
  role: string
  verificationToken: string
  isVerified: boolean
  verifiedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Provide user name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Provide and email'],
    validate: {
      validator: (email: string) => validator.isEmail(email),
      message: 'Provide a valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Provide a password'],
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  verificationToken: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: {
    type: Date,
  },
  recipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
    },
  ],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
})

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bcryptjs.genSalt(10)
  this.password = await bcryptjs.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcryptjs.compare(candidatePassword, this.password)
}

const User = mongoose.model<user>('User', UserSchema)
export default User
