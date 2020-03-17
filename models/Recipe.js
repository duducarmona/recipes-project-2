const mongoose = require('mongoose');

const { Schema } = mongoose;

const recipeSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  image: String,
  ingredients: [{
    ingredientId: {
      type: Schema.Types.ObjectId,
      ref: 'Ingredient',
    },
    amount: Number,
    unit: String,
  }],
  steps: [{
    _id: false,
    number: Number,
    step: String,
  }],
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
