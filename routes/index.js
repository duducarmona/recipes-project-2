const express = require('express');

const router = express.Router();

const bcrypt = require('bcrypt');
const User = require('../models/User');

const bcryptSalt = 10;

router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'Better Chef',
    loggedin: false,
  });
});

router.post('/', (req, res, next) => {
  const { username, password } = req.body;
  console.log(username, password);

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render('index', {
          error: `Username ${username} not found.`,
        });
      }
      if (bcrypt.compareSync(password, user.hashedPassword)) {
        req.session.currentUser = user;
        res.redirect('/recipes');
      } else {
        res.render('index', {
          error: 'Incorrect password',
        });
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/register', (req, res, next) => {
  res.render('register', {
    title: 'Better Chef',
    loggedin: false,
  });
});

router.post('/register', (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.render('register', {
          error: `Username ${user.username} already exists.`,
        });
      } else {
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashedPassword = bcrypt.hashSync(password, salt);
        User.create({
          username,
          hashedPassword,
        })
          .then(() => {
            res.redirect('/recipes');
          })
          .catch((error) => next(error));
      }
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
