var citySearch;
var APIkey = '&appid=28870b55a52a06273a2463ffab2469f7';
var weatherAPI = 'https://api.openweathermap.org/data/2.5/weather?';
var uviAPI = 'https://api.openweathermap.org/data/2.5/uvi?lat=';
var forecastAPI = 'https://api.openweathermap.org/data/2.5/forecast?q=';
var geoAPI = navigator.geolocation;
var units = '&units=imperial';
var getWeatherIcon = 'http://openweathermap.org/img/wn/';
var searchHistoryArr = [];

$(document).ready(function() {
  init();

  function init() {
    search();
    currentLocation();
    $('#weather-container').hide();
    $('#search-history-container').hide();
    $('#current-location-container').hide();
    displayHistory();
    clearHistory();
    clickHistory();
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
        // do not append the same city twice....
        $('#search-input').val('');
        var newSearch = $('<li>');
        newSearch.addClass('list-group-item');
        newSearch.text(capitalizeFirstLetter(citySearch));
        $('#search-history').prepend(newSearch);
        $('#search-history-container').show();

        var searchHistoryObj = {};

        if (searchHistoryArr.length === 0) {
          searchHistoryObj['city'] = citySearch;
          searchHistoryArr.push(searchHistoryObj);
          localStorage.setItem(
            'searchHistory',
            JSON.stringify(searchHistoryArr)
          );
        } else {
          var checkHistory = searchHistoryArr.find(
            ({ city }) => city === citySearch
          );

          if (checkHistory === undefined) {
            searchHistoryObj['city'] = citySearch;
            searchHistoryArr.push(searchHistoryObj);
            localStorage.setItem(
              'searchHistory',
              JSON.stringify(searchHistoryArr)
            );
          }
        }

        getWeather(citySearch);
      }
    });
  }

  function capitalizeFirstLetter(str) {
    return str
      .toLowerCase()
      .split(' ')
      .map(function(word) {
        return word[0].toUpperCase() + word.substr(1);
      })
      .join(' ');
  }

  function getWeather(search) {
    var queryURL = weatherAPI + 'q=' + search + units + APIkey;

    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function(response) {
      var results = response;
      var name = results.name;
      var temperature = Math.floor(results.main.temp);
      var humidity = results.main.humidity;
      var windSpeed = results.wind.speed;
      var date = new Date(results.dt * 1000).toLocaleDateString('en-US');
      var weatherIcon = results.weather[0].icon;
      var weatherIconURL = getWeatherIcon + weatherIcon + '.png';

      $('#city-name').text(name + ' (' + date + ') ');
      $('#weather-image').attr('src', weatherIconURL);
      $('#temperature').html('<b>Temperature: </b>' + temperature + ' °F');
      $('#humidity').html('<b>Humidity: </b>' + humidity + '%');
      $('#wind-speed').html('<b>Wind Speed: </b>' + windSpeed + ' MPH');

      var lat = response.coord.lat;
      var lon = response.coord.lon;
      var uviQueryURL = uviAPI + lat + '&lon=' + lon + APIkey;

      $.ajax({
        url: uviQueryURL,
        method: 'GET'
      }).then(function(uviResponse) {
        var uviResults = uviResponse;
        var uvi = uviResults.value;
        $('#uv-index').html(
          '<b>UV Index: </b>' +
            '<span class="badge badge-secondary">' +
            uvi +
            '</span>'
        );
        $('#current-forecast').show();

        // change uvi badge color depending on the value of uvi
        /* 
        if (uvi < 3) {
            green
        } else if (uvi < 6) {
            yellow
        } else if (uvi < 8) {
            orange
        } else if (uvi < 11) {
            red
        } else {
            purple
        }
        */
      });

      var cityName = name;
      var countryCode = response.sys.country;
      var forecastQueryURL =
        forecastAPI + cityName + ',' + countryCode + units + APIkey;

      $.ajax({
        url: forecastQueryURL,
        method: 'GET'
      }).then(function(forecastResponse) {
        var forecastResults = forecastResponse;
        var forecastArr = [];

        // fix the format of the cards as the screen changes sizes, etc. add padding

        for (var i = 4; i < 40; i += 8) {
          var forecastObj = {};
          var forecastResultsDate = forecastResults.list[i].dt_txt;
          var forecastDate = new Date(forecastResultsDate).toLocaleDateString(
            'en-US'
          );
          var forecastTemp = forecastResults.list[i].main.temp;
          var forecastHumidity = forecastResults.list[i].main.humidity;
          var forecastIcon = forecastResults.list[i].weather[0].icon;

          forecastObj['list'] = {};
          forecastObj['list']['date'] = forecastDate;
          forecastObj['list']['temp'] = forecastTemp;
          forecastObj['list']['humidity'] = forecastHumidity;
          forecastObj['list']['icon'] = forecastIcon;

          forecastArr.push(forecastObj);
        }

        for (var j = 0; j < 5; j++) {
          var forecastArrDate = forecastArr[j].list.date;
          var forecastIconURL =
            getWeatherIcon + forecastArr[j].list.icon + '.png';
          var forecastArrTemp = Math.floor(forecastArr[j].list.temp);
          var forecastArrHumidity = forecastArr[j].list.humidity;

          $('#date-' + (j + 1)).text(forecastArrDate);
          $('#weather-image-' + (j + 1)).attr('src', forecastIconURL);
          $('#temp-' + (j + 1)).text(
            'Temp: ' + Math.floor(forecastArrTemp) + ' °F'
          );
          $('#humidity-' + (j + 1)).text(
            'Humidity: ' + forecastArrHumidity + '%'
          );
        }
        $('#weather-container').show();
      });
    });
    clickHistory();
  }

  function currentLocation() {
    function success(position) {
      const currentLat = position.coords.latitude;
      const currentLon = position.coords.longitude;
      var currentLocationQueryURL =
        weatherAPI +
        'lat=' +
        currentLat +
        '&lon=' +
        currentLon +
        units +
        APIkey;

      $.ajax({
        url: currentLocationQueryURL,
        method: 'GET'
      }).then(function(currentLocationResponse) {
        var currentLocationResults = currentLocationResponse;
        var currentLocationName = currentLocationResults.name;
        var currentLocationTemp = currentLocationResults.main.temp;
        var currentLocationHumidity = currentLocationResults.main.humidity;
        var currentLocationIcon = currentLocationResults.weather[0].icon;
        var currentLocationIconURL =
          getWeatherIcon + currentLocationIcon + '.png';

        $('#current-location').text(currentLocationName);
        $('#weather-image-current-location').attr(
          'src',
          currentLocationIconURL
        );
        $('#temp-current-location').html(
          '<b>Temperature: </b>' + currentLocationTemp + ' °F'
        );
        $('#humidity-current-location').html(
          '<b>Humidity: </b>' + currentLocationHumidity + '%'
        );
      });

      $('#current-location-container').show();
    }

    function error() {
      $('#current-location').text('Cannot get your current location.');
    }

    if (!geoAPI) {
      $('#current-location').text(
        'Geolocation is not supported by your browser'
      );
    } else {
      geoAPI.getCurrentPosition(success, error);
    }
  }

  function displayHistory() {
    var getLocalSearchHistory = localStorage.getItem('searchHistory');
    var localSearchHistory = JSON.parse(getLocalSearchHistory);

    for (var i = 0; i < localSearchHistory.length; i++) {
      var historyLi = $('<li>');
      historyLi.addClass('list-group-item');
      historyLi.text(capitalizeFirstLetter(localSearchHistory[i].city));
      $('#search-history').prepend(historyLi);
      $('#search-history-container').show();
    }

    return (searchHistoryArr = localSearchHistory);
  }

  function clearHistory() {
    $('#clear-button').on('click', function() {
      $('#search-history').empty();
      $('#search-history-container').hide();
      localStorage.removeItem('searchHistory');
      searchHistoryArr.length = 0;
      localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArr));
    });
  }

  function clickHistory() {
    $('#search-history li').on('click', function() {
      var cityNameHistory = $(this).text();
      getWeather(cityNameHistory);
    });
  }
});
