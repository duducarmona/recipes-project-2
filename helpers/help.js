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

module.exports = {
  collect,
};
