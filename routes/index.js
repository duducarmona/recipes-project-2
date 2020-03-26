const express = require('express');

const router = express.Router();

const bcryptSalt = process.env.SALT;
const bcrypt = require('bcrypt');

const middleware = require('../helpers/redirectMiddleware');

const User = require('../models/User');

router.get('/', middleware.redirectSignedInUser, (req, res) => {
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
      } else if (bcrypt.compareSync(password, user.hashedPassword)) {
        req.session.currentUser = user;
        res.redirect('/recipes');
      } else {
        res.render('index', {
          layout: 'layout-no-nav',
          title: 'Better Chef',
          error: 'Incorrect password',
        });
      }
    })
    .catch(next);
});

router.get('/register', middleware.redirectSignedInUser, (req, res) => {
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
            res.redirect('/recipes');
          })
          .catch(next);
      }
    })
    .catch(next);
});

router.get('/forgot', middleware.redirectSignedInUser, (req, res) => {
  res.render('forgot', {
    layout: 'layout-no-nav',
    title: 'Better Chef',
  });
});

module.exports = router;
