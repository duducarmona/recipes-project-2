const express = require('express');
const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');

const router = express.Router();

// GET /recipes/add
router.get('/add', (req, res, next) => {
  Ingredient.find()
    .then((ingredients) => {
      res.render('add', {
        ingredients,
      });
    })
    .catch(next);
});

// POST /recipes
router.post('/', (req, res, next) => {
  const {
    title,
    userId,
    image,
    ingredientId,
    amount,
    unit,
    steps,
  } = req.body;

  Recipe.create({
    title,
    userId,
    image,
    ingredients: [{
      ingredientId,
      amount,
      unit,
    }],
    steps,
  })
    .then(() => {
      res.redirect('/resorts');
    })
    .catch(next);
});

module.exports = router;
