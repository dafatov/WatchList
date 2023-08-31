export const throwHttpError = response => new Promise((resolve, reject) => {
  if (response.ok) {
    resolve(response);
  } else {
    response.text()
      .then(text => reject(text));
  }
});
