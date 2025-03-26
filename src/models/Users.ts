import mongoose, { Schema, Document, model } from "mongoose"
import validator from "validator"
import bcryptjs from "bcryptjs"

export interface IUser extends Document {
  userId: string
  _id: mongoose.Schema.Types.ObjectId
  name: string
  password: string
  email: string
  role: string
  recipes: string[]
  reviews: string[]
  verificationToken: string
  isVerified: boolean
  verifiedAt: Date
  passwordToken: String
  passwordTokenExpiry: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Provide user name"],
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Provide and email"],
      validate: {
        validator: (email: string) => validator.isEmail(email),
        message: "Provide a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Provide a password"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
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
    passwordToken: {
      type: String,
    },
    passwordTokenExpiry: {
      type: Date,
    },
    recipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
)

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return
  const salt = await bcryptjs.genSalt(10)
  this.password = await bcryptjs.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcryptjs.compare(candidatePassword, this.password)
}

export default model<IUser>("User", UserSchema)
