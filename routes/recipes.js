const express = require('express');
const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');
const middleware = require('../helpers/authMiddleware');

const router = express.Router();
router.use(middleware.checkIfUserLoggedIn);

// GET /recipes
router.get('/', (req, res, next) => {
  Recipe.find()
    .populate('ingredients.ingredient')
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
    ingredient,
    amount,
    unit,
    steps,
  } = req.body;

  Recipe.create({
    title,
    userId,
    image,
    ingredients: [{
      ingredient,
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

// GET /recipes/:id
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  Recipe.findById(id)
    .populate('ingredients.ingredient')
    .then((recipe) => {
      console.log(JSON.stringify(recipe.ingredients));
      res.render('recipe', {
        recipe,
      });
    })
    .catch(next);
});

module.exports = router;
