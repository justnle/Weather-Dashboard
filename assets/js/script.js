var citySearch;
var APIkey = '&appid=28870b55a52a06273a2463ffab2469f7';
var weatherAPI = 'https://api.openweathermap.org/data/2.5/weather?q=';
var uviAPI = 'https://api.openweathermap.org/data/2.5/uvi?lat=';
var fahrenheitInt;

$(document).ready(function() {
  init();

  function init() {
    search();
    $('#current-forecast').hide();
    $('#search-history-container').hide();
  }

  function search() {
    $('#search-button').on('click', function() {
      citySearch = $('#search-input')
        .val()
        .trim();

      if (citySearch === '') {
        // also return error if value is not a real city or does not show up on openweathermap
        return;
      } else {
        // add these to localStorage
        $('#search-input').val('');
        var newSearch = $('<li>');
        newSearch.addClass('list-group-item');
        newSearch.text(capitalizeFirstLetter(citySearch));
        $('#search-history').append(newSearch);
        $('#search-history-container').show();

        getWeather(citySearch);
      }
    });
  }

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function getWeather(search) {
    var queryURL = weatherAPI + search + APIkey;

    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function(response) {
      var results = response;
      var name = results.name;
      var temperature = results.main.temp;
      var humidity = results.main.humidity;
      var windSpeed = results.wind.speed;
      var windSpeedMPH = windSpeed * 2.236936;
      var windSpeedRounded = Math.round((windSpeedMPH * 10) / 10)
      var date = new Date(results.dt * 1000).toLocaleDateString('en-US');
      var weatherIcon = results.weather[0].icon;
      var weatherIconURL =
        'http://openweathermap.org/img/wn/' + weatherIcon + '.png';
    
      convertTemperature(temperature);
      temperature = fahrenheitInt;

      $('#city-name').text(name + ' (' + date + ') ');
      $('#weather-image').attr('src', weatherIconURL);
      $('#temperature').html('<b>Temperature: </b>' + temperature + ' °F');
      $('#humidity').html('<b>Humidity: </b>' + humidity + '%');
      $('#wind-speed').html('<b>Wind Speed: </b>' + windSpeedRounded + ' MPH');

      console.log(results);

      var lat = response.coord.lat;
      var lon = response.coord.lon;
      var uviQueryURL = uviAPI + lat + '&lon=' + lon + APIkey;

      $.ajax({
        url: uviQueryURL,
        method: 'GET'
      }).then(function(uviResponse) {
        var uviResults = uviResponse;
        var uvi = uviResults.value;
        $('#uv-index').html('<b>UV Index: </b>' + uvi);
        $('#current-forecast').show();
      });
    });
  }

  function storeHistory() {
    //function to store history to localStorage
  }

  function showHistory() {
    // function to get localStorage data and display it
  }

  function clearHistory() {
    // function to clear localStorage data and also the search history <ul>
  }

  function convertTemperature(k) {
    var kelvin = parseFloat(k);
    var fahrenheit = ((kelvin - 273.15) * 9) / 5 + 32;
    fahrenheitInt = Math.floor(fahrenheit);
    var temperature = Math.floor(fahrenheit);
    return fahrenheitInt;
  }
});
