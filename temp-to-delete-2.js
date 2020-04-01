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