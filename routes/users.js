const express = require('express');
const User = require('../models/User');

const router = express.Router();

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
  const { username } = req.body;

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
