import { NextFunction, query, Request, Response } from 'express'
import Recipe, { IRecipe } from '../models/Recipe'
import { StatusCodes } from 'http-status-codes'
import CustomError from '../errors'
import { checkPermission } from '../utils'
import { v2 as cloudinary } from 'cloudinary'
import fileUpload from 'express-fileupload'
import fs from 'fs'

const createRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      description,
      imageUrl,
      ingredients,
      method,
      category,
      difficulty,
    } = req.body

    if (
      !title ||
      !description ||
      !imageUrl ||
      !Array.isArray(ingredients) ||
      !method ||
      !category
    ) {
      throw new CustomError.BadRequestError('The input data is invalid')
    }

    if (req.user) {
      const author = req.user.userId
      const recipe = new Recipe({
        title,
        description,
        imageUrl,
        ingredients,
        method,
        category,
        difficulty,
        author,
      })
      recipe.save()
      res.status(StatusCodes.OK).json({ message: 'Recipe added successfully' })
    } else {
      throw new CustomError.UnauthenticatedError('User not authenticated')
    }
  } catch (error) {
    next(error)
  }
}

const getAllRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search, category, difficulty, sort } = req.query
    let query: any = {}

    if (search) query.title = { $regex: search, $options: 'i' }
    if (category) query.category = category
    if (difficulty) query.difficulty = difficulty

    let recipesObj = Recipe.find(query)

    if (sort === 'latest') {
      recipesObj = recipesObj.sort({ createdAt: -1 })
    }
    if (sort === 'oldest') {
      recipesObj = recipesObj.sort({ createdAt: 1 })
    }
    if (sort === 'a-z') {
      recipesObj = recipesObj.sort({ title: 1 })
    }
    if (sort === 'z-a') {
      recipesObj = recipesObj.sort({ title: -1 })
    }

    const recipes = await recipesObj

    res.status(StatusCodes.OK).json({ recipes })
  } catch (error) {
    next(error)
  }
}

const getSingleRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: recipeId } = req.params
    const recipe = await Recipe.findOne({ _id: recipeId })
    res.status(StatusCodes.OK).json({ recipe })
  } catch (error) {
    next(error)
  }
}

const updateRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: recipeId } = req.params
    const { title, description, ingredients, instructions, servings } = req.body

    if (
      !title ||
      !description ||
      !Array.isArray(ingredients) ||
      !Array.isArray(instructions) ||
      typeof servings !== 'number'
    ) {
      throw new CustomError.BadRequestError('The input data is invalid')
    }

    const recipe = await Recipe.findOne({ _id: recipeId })

    if (!recipe) {
      throw new CustomError.NotFoundError('Recipe not found')
    }

    checkPermission(req.user, recipe.author.toString())

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { title, description, ingredients, instructions, servings },
      { new: true }
    )

    res.status(StatusCodes.OK).json({ updatedRecipe })
  } catch (error) {
    next(error)
  }
}

const deleteRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: recipeId } = req.params
    const recipe = await Recipe.findOne({ _id: recipeId })

    if (!recipe) {
      throw new CustomError.NotFoundError(`No recipe with id ${recipeId}`)
    }

    checkPermission(req.user, recipe.author.toString())

    await recipe.deleteOne()

    res
      .status(StatusCodes.OK)
      .json({ status: 'Success', message: 'Recipe deleted successfully' })
  } catch (error) {
    next(error)
  }
}

const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.files || !req.files.image) {
      throw new CustomError.BadRequestError('No image file uploaded')
    }

    const imageFile = req.files.image as fileUpload.UploadedFile

    const result = await cloudinary.uploader.upload(imageFile.tempFilePath, {
      use_filename: true,
      folder: 'recipe-images',
    })
    fs.unlinkSync(imageFile.tempFilePath)
    res.status(StatusCodes.OK).json({ image: { src: result.secure_url } })
  } catch (error) {
    next(error)
  }
}

export {
  createRecipe,
  getAllRecipes,
  getSingleRecipe,
  updateRecipe,
  deleteRecipe,
  uploadImage,
}
