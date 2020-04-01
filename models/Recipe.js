const mongoose = require('mongoose');

const { Schema } = mongoose;

const recipeSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  spoonacularId: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  image: String,
  ingredients: [{
    _id: false,
    ingredient: {
      type: Schema.Types.ObjectId,
      ref: 'Ingredient',
    },
    amount: Number,
    unit: String,
  }],
  instructions: [{
    _id: false,
    number: Number,
    step: String,
  }],
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
