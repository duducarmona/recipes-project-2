const express = require('express');
const createError = require('http-errors');
const unirest = require('unirest');

const router = express.Router();

const middleware = require('../helpers/redirectMiddleware');
const help = require('../helpers/help');

const Ingredient = require('../models/Ingredient');
const Recipe = require('../models/Recipe');
const User = require('../models/User');

router.use(middleware.redirectUnauthorizedUser);

// GET /recipes
router.get('/', (req, res, next) => {
  Recipe.find().sort('title')
    .populate('ingredients.ingredient')
    .populate('user')
    .then((recipes) => {
      res.render('recipes', {
        recipes,
        title: 'Recipes',
        active: { recipes: true },
      });
    })
    .catch(next);
});

// GET /recipes/add
router.get('/add', (req, res, next) => {
  Ingredient.find()
    .then((ingredients) => {
      res.render('add', {
        ingredients,
        title: 'Add recipe',
        active: { add: true },
      });
    })
    .catch(next);
});

// POST /recipes
router.post('/', (req, res, next) => {
  const {
    title,
    image,
    ingredient,
    amount,
    unit,
    steps,
  } = req.body;
  const user = req.session.currentUser._id;
  const instructions = help.collect(steps);
  const ingredients = help.ingredientsToObjects(ingredient, amount, unit);

  Recipe.create({
    title,
    user,
    image,
    ingredients,
    instructions,
  })
    .then((recipe) => {
      res.redirect(`/recipes/${recipe._id}`);
    })
    .catch(next);
});

// GET /recipes/discover
router.get('/discover', (req, res, next) => {
  Ingredient.find()
    .then((ingredients) => {
      res.render('discover', {
        ingredients,
        title: 'Discover recipes',
      });
    })
    .catch(next);
});

// POST /recipes/discover
router.post('/discover', (req, res, next) => {
  // const requestString = 'https://api.spoonacular.com/recipes/findByIngredients?apiKey=90fec4fc6b734ec8bab999ebf3f5749d&ingredients=apples,+flour,+sugar&number=3';
  let requestString = '';
  const ingredientsId = req.body.ingredient;

  // 1. Busco los ingredientes para saber sus nombres y meterlos en la consulta.
  Ingredient.find({
    _id: {
      $in: ingredientsId,
    },
  })
    .then((ingredients) => {
      console.log(ingredients);
      let ingredientNames = '';

      ingredients.forEach((ingredient) => {
        ingredientNames += `${ingredient.name},`;
      });

      console.log(ingredientNames);

      requestString = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=90fec4fc6b734ec8bab999ebf3f5749d&ingredients=${ingredientNames}&number=3`;

      // 2. Con los nombres de los ingredientes busco las recetas por ingredientes.
      return unirest.get(requestString);
    })
    .then((result) => {
      if (result.status === 200) {
        console.log(result.body);
        const recipes = result.body;
        // res.render('discover', {
        //   recipes,
        //   title: recipes.title,
        // });

        let title;
        let image;
        let ingredientsArray;
        let amountsArray;
        let unitsArray;
        let ingredients;
        let instructionsArray;
        let instructions;
        // let recipeIds;

        recipes.forEach((recipe) => {
          // recipeIds.push(recipe.id);
          requestString = `https://api.spoonacular.com/recipes/${recipe.id}/information`;

          unirest.get(requestString)
            .then((recipeNew) => {
              title = recipeNew.title;
              image = recipeNew.image;

              recipeNew.extendedIngredients.forEach((ingredient) => {
                ingredientsArray.push(ingredient.name);
                amountsArray.push(ingredient.amount);
                unitsArray.push(ingredient.unit);
              });

              ingredients = help.ingredientsToObjects(ingredientsArray, amountsArray, unitsArray);

              recipeNew.analyzedInstructions.steps.array.forEach((step) => {
                instructionsArray.push(step.step);
              });

              instructions = help.collect(instructionsArray);

              return Recipe.create({
                title,
                image,
                ingredients,
                instructions,
              })
                .then((recipeToRender) => {
                  recipeToRender.title = title;
                  recipeToRender.image = image;
                  recipeToRender.ingredients = ingredients;
                  recipeToRender.instructions = instructions;

                  recipesToRender.push(recipeToRender);
                });
            })
            // .catch();
        });
        .then((recipesToRender) => {
          res.render('discover', {
            recipesToRender,
              title: recipes.title,
            });
        })
      }
    })
    .catch(next);
  // })
  // .catch(next);

  // unirest.get(requestString)
  //   .then((result) => {
  //     if (result.status === 200) {
  //       console.log(result.body);
  //       const recipes = result.body;
  //       res.render('discover', {
  //         recipes,
  //         title: recipes.title,
  //       });
  //     }
  //   })
  //   .catch(next);
});

// GET /recipes/users/:username
router.get('/users/:username', middleware.userNameIsNotMine, (req, res, next) => {
  const { username } = req.params;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.redirect('/recipes');
      } else {
        Recipe.find({
          $or: [
            { user },
            {
              _id: {
                $in: user.favorites,
              },
            },
          ],
        }).sort('title')
          .populate('ingredients.ingredient')
          .then((recipes) => {
            res.render('recipes', {
              recipes,
              title: 'My recipes',
              active: { myRecipes: true },
            });
          })
          .catch(next);
      }
    });
});

// POST /recipes/:id/delete
router.post('/:id/delete', middleware.recipeIsNotMine, (req, res, next) => {
  const { id } = req.params;

  Recipe.findByIdAndDelete(id)
    .then(() => {
      const deletedRecipeURL = `${req.headers.origin}/recipes/${id}`;
      if (req.headers.referer === deletedRecipeURL) {
        res.redirect('/recipes');
      } else {
        res.redirect('back');
      }
    })
    .catch(next);
});

// GET /recipes/:id
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  Recipe.findById(id)
    .populate('ingredients.ingredient')
    .then((recipe) => {
      res.render('recipe', {
        recipe,
        title: recipe.title,
      });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(createError(404, 'Recipe not found'));
      } else {
        next(error);
      }
    });
});

// GET /recipes/:id/update
router.get('/:id/update', middleware.recipeIsNotMine, (req, res, next) => {
  const { id } = req.params;

  Ingredient.find()
    .then((ingredients) => {
      Recipe.findById(id)
        .populate('ingredients.ingredient')
        .then((recipe) => {
          res.render('update', {
            recipe,
            ingredients,
            title: 'Edit recipe',
          });
        })
        .catch(next);
    })
    .catch(next);
});

// POST /recipes/:id
router.post('/:id', (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    image,
    ingredient,
    amount,
    unit,
    steps,
  } = req.body;

  const instructions = help.collect(steps);
  const ingredients = help.ingredientsToObjects(ingredient, amount, unit);

  Recipe.findByIdAndUpdate(id, {
    title,
    image,
    ingredients,
    instructions,
  })
    .then(() => {
      req.flash('message', 'Recipe updated');
      res.redirect(`/recipes/${id}`);
    })
    .catch(next);
});

module.exports = router;
