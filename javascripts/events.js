
// const myLinks = (e) => {
//   const links = $(e.target).html();
//   console.log(links);
//   $('#authScreen #search #myMovies').hide();
//   if (links === 'Authentication') {
//     $('#authScreen').toggle();
//   } else if (links === 'My Movies') {
//     $('#myMovies').toggle();
//   } else if (links === 'Search') {
//     $('#search').toggle();
//   };
// };

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
    } else if (e.target.id === 'navSearch') {
      $('#myMovies').addClass('hide');
      $('#search').removeClass('hide');
      $('#authScreen').addClass('hide');
    };
  });
};

module.exports = {
  myLinks,
};
