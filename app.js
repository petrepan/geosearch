let appid = '5092421313c9ab9e8f02b90f7e94c274';
let units = 'metric';
let searchMethod;

// This function is used to check if the location searched is a string or a number.

function getSearchMethod(searchTerm) {
    if(searchTerm.length === 5 && Number.parseInt(searchTerm) + '' === searchTerm)
        searchMethod = 'zip';
    else
        searchMethod = 'q'
}

// The weather condition api is being fetched in this function

function searchWeather(searchTerm){
    getSearchMethod(searchTerm);
    fetch(`http://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchTerm}&APPID=${appid}&units=${units}`).then(result => {
        return result.json();
    }).then(result => {
        init(result);
    })
}

// The weather condition api that was fetched is implememnted on the web page
//The weather condition visibility is also being called

function init(resultFromServer) {
    let weatherDescriptionHeader = document.getElementById('weatherDescriptionHeader');
    let temperatureElement = document.getElementById('temperature');
    let windSpeedElement = document.getElementById('wind');
    let humidityElement = document.getElementById('humidity');
    let cityHeader = document.getElementById('cityHeader');
    let weatherIcon = document.getElementById('iconimg');

    weatherIcon.src = 'http://openweathermap.org/img//wn/' + resultFromServer.weather[0].icon + '@2x.png';
    let resultDescription = resultFromServer.weather[0].description;
    weatherDescriptionHeader.innerHTML = resultDescription.charAt(0).toUpperCase() + resultDescription.slice(1);
    temperatureElement.innerHTML = Math.floor(resultFromServer.main.temp) + '&#176C';
    windSpeedElement.innerHTML = 'Winds ' + Math.floor(resultFromServer.wind.speed) + 'm/s';
    humidityElement.innerHTML = 'Humidity ' + resultFromServer.main.humidity + '%';
    cityHeader.innerHTML = resultFromServer.name;

    weatherCondition();
}

// This function is to apply visibility-style to the page

function weatherCondition () {
    let weatherInfo = document.getElementById('conditions');
    weatherInfo.style.visibility = 'visible';
}

// When button is clicked, searchWeather is called (searchWeather function was where the api was being fetched). 

document.getElementById('button').addEventListener('click', () => {
    let searchTerm = document.getElementById('search').value;
    if(searchTerm)
        searchWeather(searchTerm);
    
    let errorMessage = document.getElementById('error')
    if(searchTerm === ""){
        errorMessage.textContent = "Enter a Location!!";
    } else {
        errorMessage.textContent = "";
    }
}) 

