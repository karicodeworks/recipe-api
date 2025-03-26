import express from "express"
import {
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
  verifyEmail,
} from "../controllers/authController"
import { authenticateUser } from "../middleware/authenticate"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.delete("/logout", authenticateUser, logout)
router.post("/verify-email", verifyEmail)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)

export default router
