import express from 'express'
import { login, logout, register } from '../controllers/authController'
import { authenticateUser } from '../middleware/authenticate'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.delete('/logout', authenticateUser, logout)

export default router
