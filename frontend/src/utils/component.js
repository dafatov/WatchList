export const getComponentsFromObject = componentsObject => Object.keys(componentsObject)
  .map(key => ({
    ...componentsObject[key],
    key,
  })).sort();
