const express = require('express');
const createError = require('http-errors');

const router = express.Router();

const bcryptSalt = process.env.SALT;
const bcrypt = require('bcrypt');

const middleware = require('../helpers/redirectMiddleware');

const User = require('../models/User');

router.use(middleware.redirectUnauthorizedUser);

// GET /users/logout
router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    }
    res.redirect('/');
  });
});

// GET /users/:id
router.get('/:id', middleware.userIsNotMe, (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      if (user) {
        res.render('user', {
          user,
          title: 'My account',
        });
      } else {
        next(createError(404, 'User not found'));
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(createError(404, 'User not found'));
      } else {
        next(error);
      }
    });
});

// POST /users/:id/
router.post('/:id', middleware.userIsNotMe, (req, res, next) => {
  const { id } = req.params;
  const { username } = req.body;

  User.findByIdAndUpdate(id, {
    username,
  })
    .then(() => {
      req.flash('message', 'Username changed');
      res.redirect(`/users/${id}`);
    })
    .catch(next);
});

// GET /users/:id/password
router.get('/:id/password', middleware.userIsNotMe, (req, res, next) => {
  const { id } = req.params;

  User.findById(id)
    .then((user) => {
      res.render('password', {
        user,
        title: 'Change password',
      });
    })
    .catch(next);
});

// POST /users/:id/password
router.post('/:id/password', middleware.userIsNotMe, (req, res, next) => {
  const { id } = req.params;
  const {
    password,
    newPassword,
    confirmPassword,
  } = req.body;

  if (newPassword !== confirmPassword) {
    req.flash('message', 'New passwords didn\'t match');
    res.redirect(`/users/${id}/password`);
  } else {
    User.findById(id)
      .then((user) => {
        if (bcrypt.compareSync(password, user.hashedPassword)) {
          const salt = bcrypt.genSaltSync(bcryptSalt);
          const hashedPassword = bcrypt.hashSync(newPassword, salt);
          User.findByIdAndUpdate(id, {
            hashedPassword,
          })
            .then(() => {
              req.flash('message', 'Password changed');
              res.redirect(`/users/${id}/password`);
            });
        } else {
          req.flash('message', 'Password incorrect');
          res.redirect(`/users/${id}/password`);
        }
      })
      .catch(next);
  }
});

// POST /users/:id/delete
router.post('/:id/delete', middleware.userIsNotMe, (req, res, next) => {
  const { id } = req.params;

  User.findByIdAndDelete(id)
    .then(() => {
      req.session.destroy((err) => {
        if (err) {
          next(err);
        }
        res.clearCookie(process.env.COOKIE_NAME, {
          path: '/',
        });
        res.redirect('/');
      });
    })
    .catch(next);
});

// POST /users/:id/favorites
router.post('/:id/favorites', (req, res, next) => {
  const { id } = req.params;
  const { recipeId } = req.body;
  let { isFavorite } = req.body;
  isFavorite = (isFavorite === 'true');

  User.findById(id)
    .then((user) => {
      const recipeInFavorites = user.favorites.some((favorite) => favorite.equals(recipeId));
      if (!isFavorite && !recipeInFavorites) {
        user.favorites.push(recipeId);
        user.save()
          .then((results) => {
            req.session.currentUser = user;
            res.locals.currentUser = req.session.currentUser;
            res.json(results);
          })
          .catch(next);
      } else if (isFavorite && recipeInFavorites) {
        user.favorites.pull(recipeId);
        user.save()
          .then((results) => {
            req.session.currentUser = user;
            res.locals.currentUser = req.session.currentUser;
            res.json(results);
          })
          .catch(next);
      } else {
        res.sendStatus(200);
      }
    })
    .catch(next);
});

module.exports = router;
