const express = require('express');

const router = express.Router();

const middleware = require('../helpers/redirectMiddleware');
const help = require('../helpers/help');

const Ingredient = require('../models/Ingredient');
const Recipe = require('../models/Recipe');

router.use(middleware.redirectUnauthorizedUser);

// GET /recipes
router.get('/', (req, res, next) => {
  Recipe.find().sort('title')
    .populate('ingredients.ingredient')
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
  res.render('find');
});

// GET /recipes/:username
router.get('/:username', (req, res, next) => {
  const { username } = res.locals.currentUser;
  Recipe.aggregate(
    [
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $match: {
          'user.username': username,
        },
      },
      { $unwind: '$ingredients' },
      {
        $lookup: {
          from: 'ingredients',
          localField: 'ingredients.ingredient',
          foreignField: '_id',
          as: 'ingredients.ingredient',
        },
      },
      { $unwind: '$ingredients.ingredient' },
      {
        $group: {
          _id: '$_id',
          title: { $first: '$title' },
          user: { $first: '$user' },
          image: { $first: '$image' },
          ingredients: { $push: '$ingredients' },
          instructions: { $first: '$instructions' },
        },
      },
    ],
    (err, recipes) => {
      res.render('recipes', {
        recipes,
        title: 'My recipes',
      });
    },
  )
    .catch(next);
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
      req.flash('message', 'Recipe updated!');
      res.redirect(`/recipes/${id}`);
    })
    .catch(next);
});

module.exports = router;
