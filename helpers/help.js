function collect(steps) {
  const instructions = [];
  let number = 1;
  if (typeof steps === 'string') {
    instructions.push({
      number,
      step: steps,
    });
  } else {
    steps.forEach((step) => {
      instructions.push({
        number,
        step,
      });
      number += 1;
    });
  }
  return instructions;
}

function ingredientsToObjects(ingredients, amounts, units) {
  const ingredientsObject = [];
  let ingredient;
  let amount;
  let unit;

  for (let index = 0; index < ingredients.length; index += 1) {
    ingredient = ingredients[index];
    amount = amounts[index];
    unit = units[index];

    ingredientsObject.push({
      ingredient,
      amount,
      unit,
    });
  }

  return ingredientsObject;
}

module.exports = {
  collect,
  ingredientsToObjects,
};
