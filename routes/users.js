const express = require('express');

const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

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
  const {
    username,
    password,
    newPassword,
    confirmPassword,
  } = req.body;

  if (newPassword !== confirmPassword) {
    console.log('new passwords don\'t match');
    res.redirect(`/users/${id}`);
  }

  User.findOne({ username })
    .then((user) => {
      if (!password) {
        User.findByIdAndUpdate(id, {
          username,
        });
      } else if (bcrypt.compareSync(password, user.hashedPassword)) {
        console.log('correct password');
        User.findByIdAndUpdate(id, {
          username,
          password,
        });
      } else {
        console.log('wrong password');
      }
    })
    .then(() => {
      res.redirect(`/users/${id}`);
    })
    .catch(next);
});

// GET /users/:id/password
router.get('/:id/password', (req, res) => {
  res.render('password');
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
