# Weather Dashboard
A weather dashboard page that allows the user to look up a city's weather forecast, displaying the current weather (at the user's local time) and a 5-Day forecast. For the current forecast, the user is given the temperature, humidity, wind speed, and the UV index. For the 5-Day forecast, the user is just given the temperature and the humidity. All of the information is shown with imperial units because the U.S. is still one of only three countries which has not adopted the metric system. The user can allow the web page to gain access to their current location to display their relevant weather forecast as well. The forecasts also include representative weather icons as visual aids to the weather data.

[Weather Dashboard Page](https://twopcz.github.io/HW-6/)

![Weather Dashboard Screenshot](https://github.com/twopcz/HW-6/blob/master/assets/images/weather-dashboard.png?raw=true)

# Usage
The user types in the city they want to search for on the left hand side, then clicks the search button. The user may include the country code for their search if they wish to be more specific, e.g. *Melbourne, US*  vs  *Melbourne*, which displays the forecast information for Melbourne in Florida, US instead of Melbourne, Australia.

By clicking the 'Get Location' button, the user is asked if they would like to allow the page to know their location. If the user allows, the weather for their current location, at the current time, will be displayed.

The user's most five most recent searches are displayed under the 'Search' box, which allow the user to click on them, redisplaying the weather forecast for that particular city. These five searches are stored in `localStorage` so that it persists. The user can choose to clear their search history by clicking the 'Clear History' button, removing the data from `localStorage` and the recently searched list.

If the user does not input anything, the search function does not run. If the user inputs a city name that does not exist, or is perhaps mispelled, 'City is not found' will be displayed to the user when the AJAX call returns a 404 (Not Found) status. The AJAX call will do its best to generate a response with a city, but it is not guaranteed.

# Features
The UV Index information that is displayed changes background colors based on the UV Index value. Being exposed to strong ultraviolet rays for extended periods of time can be dangerous, causing sunburn and possibly skin cancer. The colors are depicted as follows:
* **Green** - UVI under 3 (1-2), no protection advised.
* **Yellow** - UVI under 6 (3-6), protection advised.
* **Orange** - UVI under 8 (6-7), protection advised.
* **Red** - UVI under 11 (8-10), protection strongly advised.
* **Purple** - UVI 11+, protection strongly advised.

# Resources
This page was built using the API created and provided by [Open Weather](https://openweathermap.org/). It uses their APIs for current weather, 5 day / 3 hour weather forecast, and UV Index.

The geolocation API is built into the [Chrome](https://www.google.com/chrome/) web browser.

[https://getbootstrap.com/](https://getbootstrap.com/) - Bootstrap framework <br>
[https://fontawesome.com/](https://fontawesome.com/) - Fontawesome framework <br>
[https://jquery.com/](https://jquery.com/) - jQuery library <br>

# License
Licensed under the [MIT](https://github.com/twopcz/HW-6/blob/master/LICENSE.txt) license.

# References
[https://developer.mozilla.org/en-US/](https://developer.mozilla.org/en-US/) - Various documentation <br>
[https://stackoverflow.com/](https://stackoverflow.com) - Questions & Answers <br>
[https://en.wikipedia.org/](https://en.wikipedia.org/wiki/Ultraviolet_index) - Ultraviolet Index Information
