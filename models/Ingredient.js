const mongoose = require('mongoose');

const { Schema } = mongoose;

const ingredientSchema = new Schema({
  _id: Number,
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;
