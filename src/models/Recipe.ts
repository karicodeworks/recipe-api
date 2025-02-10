import mongoose, { Schema, Document } from 'mongoose'

export interface IRecipe extends Document {
  title: string
  description: string
  imageUrl: string
  ingredients: string[]
  method: string[]
  category: string
  difficulty: string
  author: mongoose.Schema.Types.ObjectId
  createdAt?: Date
  updatedAt?: Date
}

const RecipeSchema = new Schema<IRecipe>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    ingredients: [
      {
        type: String,
        required: true,
      },
    ],
    method: [
      {
        type: String,
        required: true,
      },
    ],
    category: {
      type: String,
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

const Recipe = mongoose.model<IRecipe>('Recipe', RecipeSchema)

export default Recipe
