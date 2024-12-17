import mongoose, { Schema, Document } from 'mongoose'

interface IStep {
  stepNumber: number
  instruction: string
  time?: number
}

interface IIngredient {
  ingredientNumber: number
  name: string
  quantity: number
  unit: string
  type?: string
}

interface IRecipe extends Document {
  title: string
  description: string
  ingredients: IIngredient[]
  instructions: IStep[]
  image: string
  category?: Schema.Types.ObjectId
  servings: number
  user: Schema.Types.ObjectId
}

const RecipeSchema = new Schema<IRecipe>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: [
      {
        ingredientNumber: { type: Number, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
        type: { type: String, require: false },
      },
    ],
    instructions: [
      {
        stepNumber: { type: Number, required: true },
        instruction: { type: String, required: true },
        time: { type: Number, required: false },
      },
    ],
    image: {
      type: String,
      required: false,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },
    servings: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

const Recipe = mongoose.model<IRecipe>('Recipe', RecipeSchema)

export default Recipe
