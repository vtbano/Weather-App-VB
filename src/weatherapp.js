//Feature: Date & Time Details

let now = new Date();

let dateDetails = document.querySelector(".date-and-time");

let date = now.getDate();
let hours = now.getHours();
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let year = now.getFullYear();

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let month = months[now.getMonth()];

dateDetails.innerHTML = `${day} ${month} ${date}, ${hours}:${minutes} EST`;

//Feature: Unit Conversion

function showFarenheitTemp(event) {
  event.preventDefault();
  let currentTemp = document.querySelector(".currentTemp");
  let farenheitTemp = (celsiusTemperature * 9) / 5 + 32;
  currentTemp.innerHTML = `${Math.round(farenheitTemp)}°F`;
  celsiusButton.classList.remove("active");
  farenheitButton.classList.add("active");
}

function showCelsiusTemp(event) {
  event.preventDefault();
  let currentTemp = document.querySelector(".currentTemp");
  currentTemp.innerHTML = `${Math.round(celsiusTemperature)}°C`;
  celsiusButton.classList.add("active");
  farenheitButton.classList.remove("active");
}

let farenheitButton = document.querySelector("#fahrenheitButton");
farenheitButton.addEventListener("click", showFarenheitTemp);

let celsiusButton = document.querySelector("#celsiusButton");
celsiusButton.addEventListener("click", showCelsiusTemp);

let celsiusTemperature = null;

//Feature: Search Bar
function searchInput(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#citySearch");
  let showCityInput = document.querySelector(".city-typed");
  showCityInput.innerHTML = `${cityInput.value.toUpperCase()}`;

  let apiCity = cityInput.value;
  let apiKey = "0ecc16a08b2cbf15e6cb6ef5e3476181";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${apiCity}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

function showTemperature(response) {
  let currentTemp = document.querySelector(".currentTemp");
  let weatherDescription = document.querySelector(".currentTempDscrpt");
  let weatherIconElement = document.querySelector("#weatherIcon");
  let humidityDescription = document.querySelector(".humidity");
  let currentHumidity = Math.round(response.data.main.humidity);
  let windDescription = document.querySelector(".wind");
  let currentWind = Math.round(response.data.wind.speed);
  celsiusTemperature = Math.round(response.data.main.temp);
  celsiusButton.classList.add("active");
  farenheitButton.classList.remove("active");
  currentTemp.innerHTML = `${Math.round(response.data.main.temp)}°C`;
  weatherDescription.innerHTML = response.data.weather[0].description;
  weatherIconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIconElement.setAttribute("alt", response.data.weather[0].description);
  humidityDescription.innerHTML = `Humidity: ${currentHumidity}%`;
  windDescription.innerHTML = `Wind: ${currentWind} mph`;

  getForecast(response.data.coord);
}

let button = document.querySelector(".search");
button.addEventListener("click", searchInput);

//Feature: Weekly Forecast

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  return days[day];
}

function formatForecastDate(datestamp) {
  let date = new Date(datestamp * 1000);
  let dateNumber = date.getDate();

  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  let month = months[date.getMonth()];

  return `${month} ${dateNumber}`;
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#weatherForecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
<div class="col-2">
<div class="day">${formatForecastDay(forecastDay.dt)}</div>
<div class="date">${formatForecastDate(forecastDay.dt)}</div>

<img src="http://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png" />
<div class="lowTemp">Low: ${Math.round(forecastDay.temp.min)}C</div>
<div class="highTemp">High: ${Math.round(forecastDay.temp.max)}°C</div>
</div>
`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "0ecc16a08b2cbf15e6cb6ef5e3476181";
  let lon = coordinates.lon;
  let lat = coordinates.lat;
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiURL).then(displayForecast);
}

//Feature: Pin for current weather
function pinCurrentPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "0ecc16a08b2cbf15e6cb6ef5e3476181";
  let apiPinUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiPinUrl).then((weatherData) => {
    showPinTemperature(weatherData);
  });

  let coordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  getForecast(coordinates);
}

function showPinTemperature(response) {
  let pinCity = document.querySelector(".city-typed");
  let currentTemp = document.querySelector(".currentTemp");
  let weatherDescription = document.querySelector(".currentTempDscrpt");
  let weatherIconElement = document.querySelector("#weatherIcon");
  let currentHumidity = Math.round(response.data.main.humidity);
  let humidityDescription = document.querySelector(".humidity");
  let currentWind = Math.round(response.data.wind.speed);
  let windDescription = document.querySelector(".wind");
  pinCity.innerHTML = response.data.name;
  currentTemp.innerHTML = `${Math.round(response.data.main.temp)}°C `;
  weatherDescription.innerHTML = response.data.weather[0].description;
  weatherIconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIconElement.setAttribute("alt", response.data.weather[0].description);
  humidityDescription.innerHTML = `Humidity: ${currentHumidity}%`;
  windDescription.innerHTML = `Wind Speed: ${currentWind} mph`;
}
let pin = document.querySelector(".pin");
pin.addEventListener("click", pinCurrentPosition);

navigator.geolocation.getCurrentPosition(pinCurrentPosition);
