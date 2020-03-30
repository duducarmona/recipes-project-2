const express = require('express');
const createError = require('http-errors');

const router = express.Router();

const middleware = require('../helpers/redirectMiddleware');
const help = require('../helpers/help');

const Ingredient = require('../models/Ingredient');
const Recipe = require('../models/Recipe');
const User = require('../models/User');

router.use(middleware.redirectUnauthorizedUser);

// GET /recipes
router.get('/', (req, res, next) => {
  Recipe.find().sort('title')
    .populate('ingredients.ingredient')
    .populate('user')
    .then((recipes) => {
      res.render('recipes', {
        recipes,
        title: 'Recipes',
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
        title: 'Add recipe',
      });
    })
    .catch(next);
});

// POST /recipes
router.post('/', (req, res, next) => {
  const {
    title,
    image,
    ingredient,
    amount,
    unit,
    steps,
  } = req.body;
  const user = req.session.currentUser._id;
  const instructions = help.collect(steps);
  const ingredients = help.ingredientsToObjects(ingredient, amount, unit);

  Recipe.create({
    title,
    user,
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
  res.render('find', {
    title: 'Find recipe',
  });
});

// GET /recipes/users/:username
router.get('/users/:username', middleware.userNameIsNotMine, (req, res, next) => {
  const { username } = req.params;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.redirect('/recipes');
      } else {
        Recipe.find({
          $or: [
            { user },
            {
              _id: {
                $in: user.favorites,
              },
            },
          ],
        }).sort('title')
          .populate('ingredients.ingredient')
          .then((recipes) => {
            res.render('recipes', {
              recipes,
              title: 'My recipes',
            });
          })
          .catch(next);
      }
    });
});

// POST /recipes/:id/delete
router.post('/:id/delete', middleware.recipeIsNotMine, (req, res, next) => {
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
        title: recipe.title,
      });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(createError(404, 'Recipe not found'));
      } else {
        next(error);
      }
    });
});

// GET /recipes/:id/update
router.get('/:id/update', middleware.recipeIsNotMine, (req, res, next) => {
  const { id } = req.params;

  Ingredient.find()
    .then((ingredients) => {
      Recipe.findById(id)
        .populate('ingredients.ingredient')
        .then((recipe) => {
          res.render('update', {
            recipe,
            ingredients,
            title: 'Edit recipe',
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
    image,
    ingredient,
    amount,
    unit,
    steps,
  } = req.body;

  const instructions = help.collect(steps);
  const ingredients = help.ingredientsToObjects(ingredient, amount, unit);

  Recipe.findByIdAndUpdate(id, {
    title,
    image,
    ingredients,
    instructions,
  })
    .then(() => {
      req.flash('message', 'Recipe updated');
      res.redirect(`/recipes/${id}`);
    })
    .catch(next);
});

module.exports = router;
