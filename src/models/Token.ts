import mongoose, { Document, Schema, Types } from 'mongoose'

export interface IToken extends Document {
  refreshToken: string
  ip: string
  userAgent: string
  isValid: boolean
  user: Types.ObjectId
}

const TokenSchema: Schema = new mongoose.Schema<IToken>(
  {
    refreshToken: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

const Token = mongoose.model<IToken>('Token', TokenSchema)
export default Token
