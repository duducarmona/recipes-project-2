const express = require('express');
const Recipe = require('../models/Recipe');

const router = express.Router();

// GET /recipes/add
router.get('/add', (req, res) => {
  res.render('add');
});

// POST /recipes
router.post('/', (req, res, next) => {
  const {
    name,
    userId,
    image,
    ingredients,
    steps,
  } = req.body;

  Recipe.create({
    name,
    userId,
    image,
    ingredients,
    steps,
  })
    .then(() => {
      res.redirect('/resorts');
    })
    .catch(next);
});

module.exports = router;
