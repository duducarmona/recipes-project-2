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

// GET /recipes/search
router.get('/search', (req, res, next) => {
  Ingredient.find()
    .then((ingredients) => {
      res.render('search', {
        ingredients,
        title: 'Search recipes',
      });
    })
    .catch(next);
});

function fetchInstructions(steps) {
  const results = steps.map((step) => {
    const newRecord = {
      number: step.number,
      step: step.step,
    };
    return newRecord;
  });
  return results;
}

async function fetchIngredients(extendedIngredients) {
  const promises = extendedIngredients.map(async (ingredient) => {
    const newRecord = {
      amount: ingredient.amount,
      unit: ingredient.unit,
    };
    const ingredientResult = await Ingredient.findOne({ spoonacularId: ingredient.id }).exec();
    if (ingredientResult) {
      newRecord.ingredient = ingredientResult._id;
    } else {
      console.log('need to add ingredient to our database', ingredient);
    }
    return newRecord;
  });
  const results = await Promise.all(promises);
  return results;
}

// POST /recipes/search
router.post('/search', (req, res, next) => {
  let requestString = '';
  const ingredientsId = req.body.ingredient;

  // 1. Busco los ingredientes para saber sus nombres y meterlos en la consulta.
  Ingredient.find({
    _id: {
      $in: ingredientsId,
    },
  })
    .then((ingredients) => {
      let ingredientNames = '';
      ingredients.forEach((ingredient) => {
        ingredientNames += `${ingredient.name},`;
      });
      requestString = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${process.env.API_KEY}&ingredients=${ingredientNames}&number=2`;

      // 2. Con los nombres de los ingredientes busco las recetas por ingredientes.
      return unirest.get(requestString);
    })
    .then((result) => {
      if (result.status === 200) {
        const recipes = result.body;
        recipes.forEach((recipe) => {
          console.log('recipes are', recipe.id);
          const spoonacularId = recipe.id;
          requestString = `https://api.spoonacular.com/recipes/${spoonacularId}/information?apiKey=${process.env.API_KEY}&includeNutrition=false`;
          unirest.get(requestString)
            .then((result) => {
              if (result.status === 200) {
                console.log(result.body);
                const {
                  title,
                  image,
                  extendedIngredients,
                  analyzedInstructions,
                } = result.body;
                let { instructions } = result.body;

                if (analyzedInstructions.length > 0) {
                  instructions = fetchInstructions(analyzedInstructions[0].steps);
                } else {
                  instructions = [{
                    number: 1,
                    step: instructions,
                  }];
                }
                fetchIngredients(extendedIngredients)
                  .then((ingredients) => {
                    Recipe.create({
                      spoonacularId,
                      title,
                      image,
                      ingredients,
                      instructions,
                    })
                  // .then((createdRecipe) => {
                  //   res.redirect(`/recipes/${createdRecipe._id}`);
                  // });
                  });
              }
            });
        });
      }
      return result;
    })
    .then((result) => {
      Recipe.find({
        spoonacularId: {
          $in: result.body,
        },
      }).sort('title')
        .populate('ingredients.ingredient')
        .populate('user')
        .then((recipes) => {
          res.render('recipes', {
            recipes,
            title: 'Results',
            active: { recipes: true },
          });
        });
    })
    .catch(next);
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
