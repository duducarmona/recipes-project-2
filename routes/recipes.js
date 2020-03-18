const express = require('express');
const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');

const router = express.Router();

/* GET /recipes */
router.get('/', (req, res, next) => {
  Recipe.find()
    .populate('ingredient')
    .then((recipes) => {
      res.render('recipes', {
        recipes,
      });
    })
    .catch(next);
});

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
    spoonacularId,
    amount,
    unit,
    steps,
  } = req.body;

  Recipe.create({
    title,
    userId,
    image,
    ingredients: [{
      spoonacularId,
      amount,
      unit,
    }],
    steps,
  })
    .then(() => {
      res.redirect('/recipes');
    })
    .catch(next);
});

module.exports = router;
