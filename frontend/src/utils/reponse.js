import last from 'lodash/last';

export const throwHttpError = response => new Promise((resolve, reject) => {
  if (response.ok) {
    resolve(response);
  } else {
    response.text()
      .then(text => reject(text));
  }
});

export const getCurrentOrigin = origin => {
  if (last(origin) === '/') {
    return origin.slice(0, -1);
  }

  return origin;
};

export const getAccessKey = url => {
  const parts = url.split('#');
  const queryPartUrl = parts?.[1] === 'frame'
    ? null
    : parts[1];

  if (!queryPartUrl) {
    return null;
  }

  return queryPartUrl.split('&').reduce((acc, part) => {
    const item = part.split('=');

    return {
      ...acc,
      [item[0]]: decodeURIComponent(item[1]),
    };
  }, {});
};
