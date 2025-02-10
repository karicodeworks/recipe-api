import mongoose from 'mongoose'

const RecipeSchema = new mongoose.Schema(
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

const Recipe = mongoose.model('Recipe', RecipeSchema)

export default Recipe
