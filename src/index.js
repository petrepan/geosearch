import regeneratorRuntime from "regenerator-runtime";
import appid from "./api";
import {
  location,
  icon,
  temp,
  description,
  update,
  wind,
  humidity,
  sunset,
  sunrise,
  dew,
  daily
} from "./dom";
import {
  setPosition,
  getWeather,
  showCurrentWeather,
  showDailyWeather,
  getTime,
  getDay,
  addZeroToUnderTen,
} from "./currentLocation";
import "./style.css";

let searchMethod;


// This function is used to check if the location searched is a string or a number.

function getSearchMethod(searchTerm) {
  if (
    searchTerm.length === 5 &&
    Number.parseInt(searchTerm) + "" === searchTerm
  )
    searchMethod = "zip";
  else searchMethod = "q";
}

// The weather condition api is being fetched in this function

function searchWeather(searchTerm) {
  getSearchMethod(searchTerm);
  fetch(
    `http://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchTerm}&APPID=${appid}&units=metric`
  )
    .then((result) => {
      return result.json();
    })
    .then((result) => {
      console.log(result)
      init(result);
    });
}

// The weather condition api that was fetched is implememnted on the web page
//The weather condition visibility is also being called

function init(resultFromServer) {
  icon.src =
    "http://openweathermap.org/img//wn/" +
    resultFromServer.weather[0].icon +
    "@2x.png";
  temp.innerHTML = resultFromServer.main.temp;
  let resultDescription = resultFromServer.weather[0].description;
  weatherDescriptionHeader.innerHTML =
    resultDescription.charAt(0).toUpperCase() + resultDescription.slice(1);
  temperatureElement.innerHTML =
    Math.floor(resultFromServer.main.temp) + "&#176C";
  windSpeedElement.innerHTML =
    "Winds " + Math.floor(resultFromServer.wind.speed) + "m/s";
  humidityElement.innerHTML =
    "Humidity " + resultFromServer.main.humidity + "%";
  cityHeader.innerHTML = resultFromServer.name;

  weatherCondition();
}

// This function is to apply visibility-style to the page

function weatherCondition() {
  let weatherInfo = document.getElementById("conditions");
  weatherInfo.style.visibility = "visible";
}

// When button is clicked, searchWeather is called (searchWeather function was where the api was being fetched).

document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
  let searchTerm = document.getElementById("search").value;
  if (searchTerm) searchWeather(searchTerm);

  let errorMessage = document.getElementById("error");
  if (searchTerm === "") {
    errorMessage.textContent = "Enter a Location!!";
  } else {
    errorMessage.textContent = "";
  }
});