export const getUnitPrefix = value => {
  const divider = 1024;
  const prefix = ['', 'Ki', 'Mi', 'Gi', 'Ti'];
  let index = 0;

  value = parseInt(value ?? '0');
  // eslint-disable-next-line no-loops/no-loops
  while (value / divider >= 1) {
    value = value / divider;
    index++;
  }

  return {value, prefix: prefix[index]};
};
