//Feature#1
let now = new Date();

let dateDetails = document.querySelector(".date-and-time");

let date = now.getDate();
let hours = now.getHours();
let minutes = now.getMinutes();
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

//Feature#2
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
  let weatherdescription = document.querySelector(".currentTempDscrpt");
  let humiditydescription = document.querySelector("#humidityApiResult");
  let windDescription = document.querySelector("#windApiResult");
  currentTemp.innerHTML = Math.round(response.data.main.temp);
  weatherdescription.innerHTML = response.data.weather[0].description;
  humiditydescription.innerHTML = Math.round(response.data.main.humidity);
  windDescription.innerHTML = Math.round(response.data.wind.speed);
}

let button = document.querySelector(".search");
button.addEventListener("click", searchInput);

//Feature #3
function pinCurrentPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "0ecc16a08b2cbf15e6cb6ef5e3476181";
  let apiPinUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiPinUrl).then(showPinTemperature);
}

function showPinTemperature(response) {
  let mainTemp = Math.round(response.data.main.temp);
  let currentTemp = document.querySelector(".currentTemp");
  currentTemp.innerHTML = `${mainTemp}°C`;
  let mainWeatherDescript = response.data.weather[0].description;
  let weatherdescription = document.querySelector(".currentTempDscrpt");
  weatherdescription.innerHTML = mainWeatherDescript;
  let currenthumidity = Math.round(response.data.main.humidity);
  let humiditydescription = document.querySelector(".humidity");
  humiditydescription.innerHTML = `Humidity: ${currenthumidity}%`;
  let currentwind = Math.round(response.data.wind.speed);
  let windDescription = document.querySelector(".wind");
  windDescription.innerHTML = `Wind Speed: ${currentwind} mph`;
}
let pin = document.querySelector(".pin");
pin.addEventListener("click", pinCurrentPosition);

navigator.geolocation.getCurrentPosition(pinCurrentPosition);
