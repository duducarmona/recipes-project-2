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
      req.flash('message', 'User updated!');
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
    req.flash('message', 'New password and confirm didn\'t match. Please try again.');
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
              req.flash('message', 'Password updated!');
              res.redirect(`/users/${id}/password`);
            });
        } else {
          req.flash('message', 'Wrong password. Please try again.');
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

module.exports = router;
