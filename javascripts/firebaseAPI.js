let firebaseConfig = {};
let uid = '';

const setConfig = (fbConfig) => {
  firebaseConfig = fbConfig;
};

const setUID = (newUID) => {
  uid = newUID;
};

const saveMovieToWishlist = (newMovie) => {
  newMovie.uid = uid;
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `${firebaseConfig.databaseURL}/movies.json`,
      data: JSON.stringify(newMovie),
    })
      .done((uniqueKey) => {
        resolve(uniqueKey);
      })
      .fail((error) => {
        reject(error);
      });
  });
};

const getAllMovies = () => {
  return new Promise((resolve, reject) => {
    const allMoviesArray = [];
    $.ajax({
      method: 'GET',
      url: `${firebaseConfig.databaseURL}/movies.json?orderBy="uid"&equalTo="${uid}"`,
    })
      .done((allMoviesObject) => {
        if (allMoviesObject !== null) {
          Object.keys(allMoviesObject).forEach((fbKey) => {
            allMoviesObject[fbKey].id = fbKey;
            allMoviesArray.push(allMoviesObject[fbKey]);
          });
        }
        resolve(allMoviesArray);
      })
      .fail((error) => {
        reject(error);
      });
  });
};

const getWatchedMovies = () => {
  return new Promise((resolve, reject) => {
    const allMoviesArray = [];
    $.ajax({
      method: 'GET',
      url: `${firebaseConfig.databaseURL}/movies.json?orderBy="uid"&equalTo="${uid}"`,
    })
      .done((allMoviesObject) => {
        if (allMoviesObject !== null) {
          Object.keys(allMoviesObject).forEach((fbKey) => {
            if (allMoviesObject[fbKey].isWatched) {
              allMoviesObject[fbKey].id = fbKey;
              allMoviesArray.push(allMoviesObject[fbKey]);
            };
          });
        }
        resolve(allMoviesArray);
      })
      .fail((error) => {
        reject(error);
      });
  });
};

const getWishlistMovies = () => {
  return new Promise((resolve, reject) => {
    const allMoviesArray = [];
    $.ajax({
      method: 'GET',
      url: `${firebaseConfig.databaseURL}/movies.json?orderBy="uid"&equalTo="${uid}"`,
    })
      .done((allMoviesObject) => {
        if (allMoviesObject !== null) {
          Object.keys(allMoviesObject).forEach((fbKey) => {
            if (!allMoviesObject[fbKey].isWatched) {
              allMoviesObject[fbKey].id = fbKey;
              allMoviesArray.push(allMoviesObject[fbKey]);
            };
          });
        }
        resolve(allMoviesArray);
      })
      .fail((error) => {
        reject(error);
      });
  });
};

const deleteMovieFromDb = (movieId) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'DELETE',
      url: `${firebaseConfig.databaseURL}/movies/${movieId}.json`,
    })
      .done(() => {
        resolve();
      })
      .fail((error) => {
        reject(error);
      });
  });
};

const updateMovieToWatchedInDb = (updatedMovie, movieId) => {
  updatedMovie.uid = uid;
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'PUT',
      url: `${firebaseConfig.databaseURL}/movies/${movieId}.json`,
      data: JSON.stringify(updatedMovie),
    })
      .done((modifiedMovie) => {
        resolve(modifiedMovie);
      })
      .fail((error) => {
        reject(error);
      });
  });
};

module.exports = {
  setConfig,
  saveMovieToWishlist,
  getAllMovies,
  getWatchedMovies,
  deleteMovieFromDb,
  updateMovieToWatchedInDb,
  getWishlistMovies,
  setUID,
};
