export const move = (fromList, toList, fromIndex, toIndex) => {
  toList.splice(toIndex, 0, fromList.splice(fromIndex, 1)[0]);
};
