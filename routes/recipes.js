const express = require('express');
const Recipe = require('../models/Recipe');
const Ingredient = require('../models/Ingredient');
const middleware = require('../helpers/authMiddleware');
const help = require('../helpers/help');

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

  const instructions = help.collect(steps);
  const ingredients = help.ingredientsToObjects(ingredient, amount, unit);

  Recipe.create({
    title,
    userId,
    image,
    ingredients,
    instructions,
  })
    .then(() => {
      res.redirect('/recipes');
    })
    .catch(next);
});


// GET /recipes/find
router.get('/find', (req, res) => {
  res.render('find');
});

// POST /recipes/:id/delete
router.post('/:id/delete', (req, res, next) => {
  const { id } = req.params;

  Recipe.findByIdAndDelete(id)
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
      res.render('recipe', {
        recipe,
      });
    })
    .catch(next);
});

// GET /recipes/:id/update
router.get('/:id/update', (req, res, next) => {
  const { id } = req.params;
  Ingredient.find()
    .then((ingredients) => {
      Recipe.findById(id)
        .populate('ingredients.ingredient')
        .then((recipe) => {
          res.render('update', {
            recipe,
            ingredients,
          });
        })
        .catch(next);
    })
    .catch(next);
});

// POST /recipes/:id
router.post('/:id', (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    userId,
    image,
    ingredient,
    amount,
    unit,
    steps,
  } = req.body;

  const instructions = help.collect(steps);
  Recipe.findByIdAndUpdate(id, {
    title,
    userId,
    image,
    ingredients: [{
      ingredient,
      amount,
      unit,
    }],
    instructions,
  })
    .then(() => {
      res.redirect(`/recipes/${id}`);
    })
    .catch(next);
});

module.exports = router;
