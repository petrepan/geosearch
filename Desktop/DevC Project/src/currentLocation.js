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
import appid from "./api"

export const setPostion = function () { 
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      let lat = position.coords.latitude;
      let long = position.coords.longitude;
      console.log(lat, long);
      getWeather(lat, long);
    });
  } else {
    window.alert("Could not get location");
  }
};

export function getWeather(lat, long) {
  let api = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${appid}&units=metric`;
  fetch(api)
    .then(function (res) {
      return res.json();
    })
    .then(function (resp) {
      showCurrentWeather(resp.current);
      showDailyWeather(resp.daily);
    });
}

export function showCurrentWeather(current) {
  location.innerText = "Your Current Location";
  update.innerText = `Updated as at ${getTime(current.dt)}`;
  temp.innerHTML = `${Math.round(current.temp)} <span>&#176C</span>`;
  description.innerHTML = current.weather[0].main;
  wind.innerHTML = `${current.wind_speed} <span>m/s</span>`;
  humidity.innerHTML = `${current.humidity} <span>%</span>`;
  sunrise.innerText = getTime(current.sunrise);
  sunset.innerText = `${getTime(current.sunset)}`;
  dew.innerHTML = `${Math.round(current.dew_point)} <span>&#176</span>`;
}

export function showDailyWeather(dailyresult) {
    let div = "";
    console.log(dailyresult);
    dailyresult.forEach(daily => {
        div += `<div><div>${getDay(daily.dt)}</div>
        <img src="">
        <div><span>${daily.temp.max}</span><span>${daily.temp.min}</span></div>
        <div>${daily.weather[0].description}</div></div>
        `;
    })
    console.log(div)
    daily.innerHTML = div
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