function gather(steps) {
  const instructions = [];
  let number = 0;
  steps.forEach((step) => {
    number += 1;
    instructions.push({
      number,
      step,
    });
  });
  return instructions;
}

module.exports = {
  gather,
};
