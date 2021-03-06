/* eslint camelcase: 0 */

const dom = require('./dom');
const tmdb = require('./tmdb');
const firebaseApi = require('./firebaseAPI');

const myLinks = () => {
  $(document).click((e) => {
    if (e.target.id === 'authenticate') {
      $('#myMovies').addClass('hide');
      $('#search').addClass('hide');
      $('#authScreen').removeClass('hide');
    } else if (e.target.id === 'mine') {
      $('#myMovies').removeClass('hide');
      $('#search').addClass('hide');
      $('#authScreen').addClass('hide');
      getAllMoviesEvent();
    } else if (e.target.id === 'navSearch') {
      $('#myMovies').addClass('hide');
      $('#search').removeClass('hide');
      $('#authScreen').addClass('hide');
    };
  });
};

const pressEnter = () => {
  $(document).keypress((e) => {
    if (e.key === 'Enter' && !$('#search').hasClass('hide')) {
      const searchWords = $('#searchBar').val().replace(' ', '%20');
      tmdb.showResults(searchWords);
    };
  });
};

const saveMovieToWishlistEvent = () => {
  $(document).on('click', '.addMovieToWishList', (e) => {
    const movieToAddCard = $(e.target).closest('.movie');
    const movieToAdd = {
      title: movieToAddCard.find('.movie-title').text(),
      overview: movieToAddCard.find('.movie-overview').text(),
      poster_path: movieToAddCard.find('img').data('poster'),
      rating: 0,
      isWatched: false,
    };
    firebaseApi.saveMovieToWishlist(movieToAdd)
      .then(() => {
        movieToAddCard.remove();
      })
      .catch((error) => {
        console.error('error in saving movie', error);
      });
  });
};

const getAllMoviesEvent = () => {
  firebaseApi.getAllMovies()
    .then((moviesArray) => {
      dom.domString(moviesArray, tmdb.getImageConfig(), 'savedMovies', true);
    })
    .catch((error) => {
      console.error('error in get all movies', error);
    });
};

const getWatchedMoviesEvent = () => {
  firebaseApi.getWatchedMovies()
    .then((moviesArray) => {
      dom.domString(moviesArray, tmdb.getImageConfig(), 'savedMovies', true);
    })
    .catch((error) => {
      console.error('error in get watched movies', error);
    });
};

const getWishlistMoviesEvent = () => {
  firebaseApi.getWishlistMovies()
    .then((moviesArray) => {
      dom.domString(moviesArray, tmdb.getImageConfig(), 'savedMovies', true);
    })
    .catch((error) => {
      console.error('error in get wishlist movies', error);
    });
};

const deleteMovieFromFirebase = () => {
  $(document).on('click', '.deleteMovieFromCollectionEvent', (e) => {
    const movieToDeleteId = $(e.target).closest('.movie').data('firebaseId');
    firebaseApi.deleteMovieFromDb(movieToDeleteId)
      .then(() => {
        getAllMoviesEvent();
      })
      .catch((error) => {
        console.error('error on delete', error);
      });
  });
};

const updateMovieEvent = () => {
  $(document).on('click', '.updateMovieToWatched', (e) => {
    const movieToUpdateId = $(e.target).closest('.movie').data('firebaseId');
    const movieToUpdateCard = $(e.target).closest('.movie');
    const updatedMovie = {
      title: movieToUpdateCard.find('.movie-title').text(),
      overview: movieToUpdateCard.find('.movie-overview').text(),
      poster_path: movieToUpdateCard.find('img').data('poster'),
      rating: 0,
      isWatched: true,
    };
    firebaseApi.updateMovieToWatchedInDb(updatedMovie, movieToUpdateId)
      .then(() => {
        getAllMoviesEvent();
      })
      .catch((error) => {
        console.error('error on update movie', error);
      });
  });
};

const filterEvents = () => {
  $('#filterButtons').on('click', (e) => {
    const classList = e.target.classList;
    if (classList.contains('wishlist')) {
      getWishlistMoviesEvent();
    } else if (classList.contains('watched')) {
      getWatchedMoviesEvent();
    } else {
      getAllMoviesEvent();
    }
  });
};

const authEvents = () => {
  $('#signin-btn').click((e) => {
    e.preventDefault();
    const email = $('#inputEmail').val();
    const pass = $('#inputPassword').val();
    firebase.auth().signInWithEmailAndPassword(email, pass)
      .catch((error) => {
        $('#signin-error-msg').text(error.message);
        $('#signin-error').removeClass('hide');
        console.error(error.message);
      });
  });
  $('#register-btn').click(() => {
    const email = $('#registerEmail').val();
    const pass = $('#registerPassword').val();
    firebase.auth().createUserWithEmailAndPassword(email, pass).catch((error) => {
      $('#register-error-msg').text(error.message);
      $('#register-error').removeClass('hide');
      console.error(error.message);
    });
  });

  $('#register-link').click(() => {
    $('#login-form').addClass('hide');
    $('#registration-form').removeClass('hide');
  });
  $('#signin-link').click(() => {
    $('#login-form').removeClass('hide');
    $('#registration-form').addClass('hide');
  });
  $('#logout').click(() => {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      $('#inputEmail').val('');
      $('#inputPassword').val('');
      $('#movies').html('');
      $('#searchBar').val('');
    }).catch((error) => {
      console.error(error);
    });
  });
};

const initializer = () => {
  myLinks();
  pressEnter();
  saveMovieToWishlistEvent();
  deleteMovieFromFirebase();
  updateMovieEvent();
  filterEvents();
  authEvents();
};

module.exports = {
  initializer,
  getAllMoviesEvent,
};
