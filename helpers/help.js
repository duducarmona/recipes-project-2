function gather(steps) {
  const instructions = [];
  let number = 1;
  if (typeof steps === 'string') {
    instructions.push({
      number,
      steps,
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
  gather,
};
