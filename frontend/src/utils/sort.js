export const getCustomSort = (prepareShowAnimes, indexes, warningConsumer) => (data, columnIndex, order) => {
  const orderValue = 2 * (order === 'asc') - 1;
  const preparedShowAnimes = prepareShowAnimes();

  const getAnime = data => preparedShowAnimes[data.index];
  const getIsPattern = data => getAnime(data).isPattern;
  const getSortIndex = data => {
    const anime = getAnime(data);
    const index = indexes.indexOf(anime.id) + 1;

    if (!index && anime.status === 'PLANNING') {
      warningConsumer?.(anime);
    }

    return index;
  };

  return data.sort((a, b) => {
    if (indexes) {
      return getSortIndex(a) - getSortIndex(b);
    }

    if (getIsPattern(a) || getIsPattern(b)) {
      return getIsPattern(a) - getIsPattern(b);
    } else {
      const aValue = a.data[columnIndex] ?? '';
      const bValue = b.data[columnIndex] ?? '';

      return orderValue * (typeof aValue?.localeCompare === 'function'
        ? aValue.localeCompare(bValue)
        : aValue - bValue);
    }
  });
};
