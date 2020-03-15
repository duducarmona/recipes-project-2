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
      console.log('Response is ', JSON.stringify(user));
      if (user) {
        res.render('index', { error: `Username ${user.username} already exists.` });
      } else {
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);
        console.log('Creating user', username);
        User.create({
          username,
          password: hashPass,
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
