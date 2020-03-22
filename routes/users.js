const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

const bcryptSalt = process.env.COOKIE_NAME;

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
router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      res.render('user', {
        user,
      });
    })
    .catch(next);
});

// POST /users/:id/update
router.post('/:id/update', (req, res, next) => {
  const { id } = req.params;
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (password) {
        if (bcrypt.compareSync(password, user.hashedPassword)) {
          console.log('correct');
        } else {
          res.render('user', {
            error: 'Incorrect password',
          });
        }
      }
    })
    .catch(next);

  User.findByIdAndUpdate(id, {
    username,
  })
    .then(() => {
      res.redirect(`/users/${id}`);
    })
    .catch(next);
});

// POST /users/:id/delete
router.post('/:id/delete', (req, res, next) => {
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
