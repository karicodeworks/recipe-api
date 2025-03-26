"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var RecipeSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    ingredients: [
        {
            type: String,
            required: true,
        },
    ],
    method: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ["Breakfast", "Lunch", "Dinner", "Dessert"],
        required: true,
    },
    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        required: true,
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
var Recipe = mongoose_1.default.model("Recipe", RecipeSchema);
exports.default = Recipe;
