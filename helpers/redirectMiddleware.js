const createError = require('http-errors');
const Recipe = require('../models/Recipe');

function redirectSignedInUser(req, res, next) {
  if (req.session.currentUser) {
    res.redirect('/recipes');
  } else {
    next();
  }
}

function redirectUnauthorizedUser(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/');
  }
}

function userIsNotMe(req, res, next) {
  if (req.session.currentUser._id === req.params.id) {
    next();
  } else {
    next(createError(403));
  }
}

function userNameIsNotMine(req, res, next) {
  if (req.session.currentUser.username === req.params.username) {
    next();
  } else {
    next(createError(403));
  }
}

function recipeIsNotMine(req, res, next) {
  const { id } = req.params;

  Recipe.find({ _id: id, user: req.session.currentUser._id })
    .then((recipe) => {
      if (recipe.length === 1) {
        next();
      } else {
        next(createError(403, 'You only can modify your recipes.'));
      }
    })
    .catch(next);
}

module.exports = {
  redirectSignedInUser,
  redirectUnauthorizedUser,
  userIsNotMe,
  userNameIsNotMine,
  recipeIsNotMine,
};
