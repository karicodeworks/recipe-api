import express from "express"
import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
} from "../controllers/userController"
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authenticate"

const router = express.Router()

router
  .route("/")
  .get([authenticateUser, authorizePermissions("admin")], getAllUsers)
router.route("/showMe").get([authenticateUser], showCurrentUser)
router.route("/:id").get([authenticateUser], getSingleUser)

export default router
