var currentDay = (moment().format("MM/DD/YYYY"));
var cityToSearch = "";
var savedSearches = [];

//function to run on page load
getSearchHistory();

// function to execute when search button clicked
$(".search").click(function () {
    // grab text Input and assign to cityToSearch
    event.preventDefault();
    document.getElementById("main-card").className = "card visible";
    cityToSearch = $("#city-input").val();
    console.log(cityToSearch);
    if (cityToSearch !== "") {
        savedSearches.push(cityToSearch);
        // save to local storage
        localStorage.setItem("saved-searches", JSON.stringify(savedSearches));
        //clear divs before generating new weather 
        $("#current-city-name").empty();
        $("#current-weather-card").empty();
        //call functions to search weather and add newly stored search to search history list
        searchWeather();
        getSearchHistory();
        generateForecast();
    }
});
//listens for button clicks on search history buttons
$(".saved-stuff-to-show").click(function () {
    // grab text Input and assign to cityToSearch
    event.preventDefault();
    cityToSearch = $(this).text();
    console.log(cityToSearch);
    //clears previous weather information
    $("#current-city-name").empty();
    $("#current-weather-card").empty();
    //call function to search weather
    searchWeather();
    generateForecast();
});

function searchWeather() {
    document.getElementById("main-card").className = "card visible";
    var key = "eb351a084e41464ee7914d632b4670ce";
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/weather?q=" + cityToSearch + "&appid=" + key,
        method: "GET"
    }).then(function (response) {
        var temp = Number(response.main.temp);
        var fTemp = parseInt(1.8 * (temp - 273) + 32);
        var humidity = response.main.humidity;
        var windSpeed = response.wind.speed;
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var icon = response.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/w/" + icon + ".png";
        var cityName = response.name;
        var currentWeatherHeader = cityName + "(" + currentDay + ")";

        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/onecall?lat=42.46&lon=-71.06&appid=" + key,
            method: "GET"
        }).then(function (response) {
            UVindex = response.current.uvi;
            $("#current-city-name").append(`${currentWeatherHeader}`);
            $("#current-city-name").append(`<img src="${iconURL}">`);
            $("#current-weather-card").append(`<p>Temperature: ${fTemp}&deg;F</p>`);
            $("#current-weather-card").append(`<p>Humidity: ${humidity}%</p>`);
            $("#current-weather-card").append(`<p>Wind Speed: ${windSpeed}MPH</p>`);
            $("#current-weather-card").append(`<p>UV Index: ${UVindex}</p>`);
        });
    });
};

function generateForecast() {
    var key = "eb351a084e41464ee7914d632b4670ce";
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/weather?q=" + cityToSearch + "&appid=" + key,
        method: "GET"
    }).then(function (response) {
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/onecall?lat=42.46&lon=-71.06&appid=" + key,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            for (let i = 0; i < 5; i++) {
                var icon = response.daily[i].weather[0].icon;
                var iconURL = "http://openweathermap.org/img/w/" + icon + ".png";
                var temp = Number(response.daily[i].temp.day);
                var fTemp = parseInt(1.8 * (temp - 273) + 32);
                var humidity = response.daily[i].humidity;
                var day = moment().add((i + 1), "days").format("MM/DD/YYYY")
                console.log(day);
                console.log("icon: " + icon);
                console.log("F: " + fTemp);
                console.log("humidity: " + humidity);
                console.log("_______________");
                var forecastCard = $(`<div class="card bg-primary text-white"></div>`);
                var cardBody = forecastCard.append($(`<div class="card-body ml-2"></div>`));
                cardBody.append(`<p>${day}</p>`);
                cardBody.append(`<img src="${iconURL}">`);
                cardBody.append(`<p>Temp: ${fTemp}&deg;F</p>`);
                cardBody.append(`<p>Humidity: ${humidity}%</p>`);
                $(".card-deck").append(forecastCard);
            }
        });
    });
};
// gets search history from local storage and call function to render them to the dom
function getSearchHistory() {
    var storedSearches = JSON.parse(localStorage.getItem("saved-searches"));

    if (storedSearches !== null) {
        savedSearches = storedSearches;
        renderSearchHistory();
    }
};
// renders search history to the dom
function renderSearchHistory() {
    $(".list-group").empty();
    for (let i = 0; i < savedSearches.length; i++) {

        $(".list-group").prepend(`<button type="button" class="list-group-item list-group-item-action saved-stuff-to-show">${savedSearches[i]}</button)`);
        console.log(i + " times run");
    };
};



