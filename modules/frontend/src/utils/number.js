/**
 * @param array: [number]
 * @example [1, 2, 3, 5, 6, 7, 9, 10, 12] -> '1-3, 5-7, 9, 10, 12'
 * @return string
 */
module.exports.pack = array => {
  array = array.sort((a, b) => a - b);
  let result = '';

  // eslint-disable-next-line no-loops/no-loops
  for (let i = 0, count; i < array.length; i++) {
    count = 0;
    result = result.concat(array[i]);

    // eslint-disable-next-line no-loops/no-loops
    while (array[i + 1] === array[i] + 1) {
      i++;
      count++;
    }

    if (count !== 0) {
      if (count === 1) {
        result = result.concat(', ');
      } else {
        result = result.concat('-');
      }

      result = result.concat(array[i]);
    }

    if (i < array.length - 1) {
      result = result.concat(', ');
    }
  }

  return result;
};
