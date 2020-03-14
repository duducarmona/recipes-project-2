const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { layout: 'layout.hbs', title: 'Better Chef', loggedin: false });
});

module.exports = router;
