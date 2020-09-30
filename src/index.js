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
  feels_like,
  daily,
  hour,
  error,
  country,
} from "./dom";
import {
  setPosition,
  getWeather,
  showCurrentWeather,
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
      console.log(result);
      if (result.cod != "404") {
        useLatAndLong(result.coord)
        init(result);
      } else {  
      error.innerHTML = "Location not available";
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

// The weather condition api that was fetched is implememnted on the web page
//The weather condition visibility is also being called

function init(current) {
  location.innerText = `${current.name}`;
  country.innerText = `${current.sys.country}`;
  update.innerText = `Updated as at ${getTime(current.dt)}`;
  icon.innerHTML = `<img src=http://openweathermap.org/img//wn/${current.weather[0].icon}@2x.png />`;
  temp.innerHTML = `${Math.round(current.main.temp)} <span>&#176C</span>`;
  description.innerHTML = current.weather[0].description;
  wind.innerHTML = `${current.wind.speed} <span>m/s</span>`;
  humidity.innerHTML = `${current.main.humidity} <span>%</span>`;
  sunrise.innerText = getTime(current.sys.sunrise);
  sunset.innerText = `${getTime(current.sys.sunset)}`;
  feels_like.innerHTML = `${Math.round(current.main.feels_like)} <span>&#176C</span>`;
  myBar.style.width = `${current.main.humidity}%`;

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
  let searchTerm = document.getElementById("search").value.trim();
  if (searchTerm) searchWeather(searchTerm);

  let errorMessage = document.getElementById("error");
  if (searchTerm === "") {
    errorMessage.textContent = "Enter a Location!!";
  } else {
    errorMessage.textContent = "";
  }
});


/* get data for hourly and daily weather */

function useLatAndLong(result) {
  let api = `http://api.openweathermap.org/data/2.5/onecall?lat=${result.lat}&lon=${result.lon}&appid=${appid}&units=metric`;
  fetch(api)
    .then(function (res) {
      return res.json();
    })
    .then(function (resp) {
      console.log(resp);
      showHourWeather(resp.hourly.slice(0, 12));
      showDailyWeather(resp.daily);
    });
}

function showHourWeather(hourresult) {
  let div = "";
  hourresult.forEach((hour) => {
    div += `<div>
        <div>${getTime(hour.dt)}</div>
        <img src=http://openweathermap.org/img//wn/${hour.weather[0].icon}.png>
        <div class="hourtemp"><span>${Math.round(hour.temp)}&#176</span></div>
        <div>${hour.weather[0].description}</div>
        </div>
        `;
  });
  hour.innerHTML = div;
}
function showDailyWeather(dailyresult) {
  let div = "";
  dailyresult.forEach((daily) => {
    div += `<div>
        <div>${getDay(daily.dt)}</div>
        <img src=http://openweathermap.org/img//wn/${daily.weather[0].icon}.png>
        <div class="dailytemp"><span>${Math.round(
          daily.temp.max
        )}&#176</span><span>${Math.round(daily.temp.min)}&#176</span></div>
        <div>${daily.weather[0].description}</div>
        </div>
        `;
  });
  daily.innerHTML = div;
}

//register sw
 if ("serviceWorker" in navigator) {
   window.addEventListener("load", () => {
     navigator.serviceWorker
       .register("/service-worker.js")
       .then((registration) => {
         console.log("SW registered: ", registration);
       })
       .catch((registrationError) => {
         console.log("SW registration failed: ", registrationError);
       });
   });
}
 