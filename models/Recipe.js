const mongoose = require('mongoose');

const { Schema } = mongoose;

const recipeSchema = new Schema({
  name: {
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
    unit: Text,
  }],
  steps: [{
    number: Number,
    step: Text,
  }],
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
