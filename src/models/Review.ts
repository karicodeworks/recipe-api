import mongoose from 'mongoose'

const ReviewSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    recipe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
    },
  },
  { timestamps: true }
)

const Review = mongoose.model('Review', ReviewSchema)

export default Review
