const express = require('express');

const router = express.Router();

const bcrypt = require('bcrypt');
const User = require('../models/User');

const bcryptSalt = 10;

router.get('/', (req, res) => {
  res.render('index', {
    layout: 'layout-no-nav',
    title: 'Better Chef',
  });
});

router.post('/', (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render('index', {
          layout: 'layout-no-nav',
          title: 'Better Chef',
          error: `Username ${username} not found.`,
        });
      }
      if (bcrypt.compareSync(password, user.hashedPassword)) {
        req.session.currentUser = user;
        req.app.locals.currentUser = req.session.currentUser;
        res.redirect('/recipes');
      } else {
        res.render('index', {
          layout: 'layout-no-nav',
          title: 'Better Chef',
          error: 'Incorrect password',
        });
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/register', (req, res) => {
  res.render('register', {
    layout: 'layout-no-nav',
    title: 'Better Chef',
  });
});

router.post('/register', (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.render('register', {
          layout: 'layout-no-nav',
          title: 'Better Chef',
          error: `Username ${user.username} already exists.`,
        });
      } else {
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashedPassword = bcrypt.hashSync(password, salt);
        User.create({
          username,
          hashedPassword,
        })
          .then((newUser) => {
            req.session.currentUser = newUser;
            req.app.locals.currentUser = req.session.currentUser;
            res.redirect('/recipes');
          })
          .catch((error) => next(error));
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.get('/forgot', (req, res) => {
  res.render('forgot', {
    layout: 'layout-no-nav',
    title: 'Better Chef',
  });
});

module.exports = router;
