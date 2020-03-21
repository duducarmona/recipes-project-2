const express = require('express');

const router = express.Router();

// /* GET users listing. */
// router.get('/', (req, res) => {
//   res.send('respond with a resource');
// });

// GET /recipes/:id
router.get('/:id/update', (req, res, next) => {
  const { id } = req.params;
  Ingredient.find()
    .then((ingredients) => {
      Recipe.findById(id)
        .populate('ingredients.ingredient')
        .then((recipe) => {
          res.render('update', {
            recipe,
            ingredients,
          });
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = router;
