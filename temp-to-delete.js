
router.get('/get-and-save-recipe/:spoonacularId', (req, res, next) => {
  const { spoonacularId } = req.params;
  const requestString = `https://api.spoonacular.com/recipes/${spoonacularId}/information?apiKey=${process.env.API_KEY}&includeNutrition=false`;
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

        const instructions = fetchInstructions(analyzedInstructions[0].steps);
        fetchIngredients(extendedIngredients)
          .then((ingredients) => {
            Recipe.create({
              title,
              image,
              ingredients,
              instructions,
            })
              // .then((recipe) => {
              //   res.redirect(`/recipes/${recipe._id}`);
              // });
          });
      }
    })
    .catch(next);
});