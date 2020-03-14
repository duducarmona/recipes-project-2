const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { layout: 'layout-no-nav.hbs', title: 'Better Chef' });
});

module.exports = router;
