var citySearch;

$(document).ready(function() {
  init();

  function init() {
    search();
  }

  function search() {
    $('#search-button').on('click', function() {
      citySearch = $('#search-input')
        .val()
        .trim();

      if (citySearch === '') {
        return;
      } else {
        console.log(citySearch);
        $('#search-input').val('');
        var newSearch = $('<li>');
        newSearch.addClass('list-group-item');
        newSearch.text(citySearch);
        $('#search-history').append(newSearch);
      }
    });
  }



});
