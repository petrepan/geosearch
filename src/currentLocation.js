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
  loading,
  myBar,
} from "./dom";
import appid from "./api";

export const setPostion = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      let lat = position.coords.latitude;
      let long = position.coords.longitude;
      getWeather(lat, long);
    });
  } else {
    window.alert("Could not get location");
  }
};

export function getWeather(lat, long) {
  let api = `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${appid}&units=metric`;
  fetch(api)
    .then(function (res) {
      return res.json();
    })
    .then(function (resp) {
      console.log(resp);

      loading.style.display = "none";
      showCurrentWeather(resp.current);
      showHourWeather(resp.hourly.slice(0, 12))
      showDailyWeather(resp.daily);
    });
}

export function showCurrentWeather(current) {
  location.innerText = `your current location`;
  update.innerText = `Updated as at ${getTime(current.dt)}`;
  icon.innerHTML = `<img src=http://openweathermap.org/img//wn/${current.weather[0].icon}@2x.png />`;
  temp.innerHTML = `${Math.round(current.temp)} <span>&#176C</span>`;
  description.innerHTML = current.weather[0].description;
  wind.innerHTML = `${current.wind_speed} <span>m/s</span>`;
  humidity.innerHTML = `${current.humidity} <span>%</span>`;
  sunrise.innerText = getTime(current.sunrise);
  sunset.innerText = `${getTime(current.sunset)}`;
  feels_like.innerHTML = `${Math.round(
    current.feels_like
  )} <span>&#176C</span>`;
  myBar.style.width = `${current.humidity}%`;
}

export function showHourWeather(hourresult) {
  let div = "";
  hourresult.forEach((hour) => {
    div += `<div>
        <div>${getTime(hour.dt)}</div>
        <img src=https://cors-anywhere.herokuapp.com/http://openweathermap.org/img//wn/${
          hour.weather[0].icon
        }.png>
        <div class="hourtemp"><span>${Math.round(hour.temp)}&#176</span></div>
        <div>${hour.weather[0].description}</div>
        </div>
        `;
  });
  hour.innerHTML = div;
}

export function showDailyWeather(dailyresult) {
  let div = "";
  dailyresult.forEach((daily) => {
    div += `<div>
        <div>${getDay(daily.dt)}</div>
        <img src=https://cors-anywhere.herokuapp.com/http://openweathermap.org/img//wn/${
          daily.weather[0].icon
        }.png>
        <div class="dailytemp"><span>${Math.round(
          daily.temp.max
        )}&#176</span><span>${Math.round(daily.temp.min)}&#176</span></div>
        <div>${daily.weather[0].description}</div>
        </div>
        `;
  });
  daily.innerHTML = div;
}

export function getTime(unix) {
  const date = new Date(unix * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  // const seconds = date.getSeconds();
  return `${addZeroToUnderTen(hours)}:${addZeroToUnderTen(minutes)}`;
}

export function getDay(unix) {
  return new Date(unix * 1000).toDateString().trim().slice(0, 10);
}

export function addZeroToUnderTen(input) {
  return input < 10 ? "0" + input : input;
}

setPostion();
