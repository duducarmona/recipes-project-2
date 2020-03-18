const express = require('express');
const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');
const middleware = require('../helpers/authMiddleware');

const router = express.Router();
router.use(middleware.checkIfUserLoggedIn);

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
