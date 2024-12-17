import express from 'express'
import {
  createRecipe,
  deleteRecipe,
  getAllRecipes,
  getSingleRecipe,
  updateRecipe,
  uploadImage,
} from '../controllers/recipeController'
import { authenticateUser } from '../middleware/authenticate'

const router = express.Router()

router.route('/').post([authenticateUser], createRecipe).get(getAllRecipes)

router
  .route('/:id')
  .get(getSingleRecipe)
  .patch([authenticateUser], updateRecipe)
  .delete([authenticateUser], deleteRecipe)

router.route('/upload-image').post([authenticateUser], uploadImage)

export default router
