import mongoose, { Schema, Document } from 'mongoose'

interface ICategory extends Document {
  name: string
  description?: string
}

const CategorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: false,
  },
})

const Category = mongoose.model<ICategory>('Category', CategorySchema)

export default Category
