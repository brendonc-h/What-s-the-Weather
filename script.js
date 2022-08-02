var searchFormEl = document.querySelector("#city-search");
var submitBtnEl = document.querySelector(".btn");
var humidityEl = document.querySelector("#humidity");
var tempEl = document.querySelector("#temp");
var windEl = document.querySelector("#wind");
var uviIndexEl = document.querySelector("#uvi-index");
var dateEl = document.querySelector("#date");
var tempCardEl = document.querySelector("#temp-card");
var windCardEl = document.querySelector("#wind-card");
var humidityCardEl = document.querySelector("#humidity");
var iconEl = document.querySelector("#icon");
var searchContainer = document.querySelector(".card-body");
var todaysDate = moment().format("MMMM Do YY");
var fiveDayEl = document.querySelector(".fiveday-container");
var cityNameEl = document.querySelector("#city-name");

submitBtnEl.addEventListener("click", weatherApi);

var keyApi = "4e675af444e6adb8bb8ceccdf591aa06";

function weatherApi(event) {
  event.preventDefault();
  fetch(
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
      searchFormEl.value +
      "&appid=" +
      keyApi
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const lon = data[0].lon;
      const lat = data[0].lat;
      const name = data[0].name;

      var cityStorage = JSON.parse(localStorage.getItem("cityStorage")) || [];
      var found = false;
      for (let index = 0; index < cityStorage.length; index++) {
        if (cityStorage[index][0] == searchFormEl.value) {
          found = true;
        }
      }
      if (!found) {
        cityStorage.push([lon, lat, name]);
        localStorage.setItem("cityStorage", JSON.stringify(cityStorage));
        
      }

      getLocalStorage();

      dataWeather(lon, lat, name);
    });
}
function dataWeather(lon, lat, name) {
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hour&units=imperial&appid=4e675af444e6adb8bb8ceccdf591aa06`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log(name);
      const uvi = data.current.uvi;
      const humidity = data.current.humidity;
      const windSpeed = data.current.wind_speed;
      const temp = data.current.temp;
      const icon = data.current.weather[0].icon;
      const urlIcon = "https://openweathermap.org/img/w/" + icon + ".png";

      humidityEl.textContent = `humidity: ${humidity}`;
      tempEl.textContent = `temperature: ${temp}`;
      windEl.textContent = `windspeed: ${windSpeed}`;
      uviIndexEl.textContent = `uvi: ${uvi}`;
      iconEl.setAttribute("src", urlIcon);
        console.log(data);
      //fivedayforecast
      const dayOne = data.daily[1];
      const dayTwo = data.daily[2];
      const dayThree = data.daily[3];
      const dayFour = data.daily[4];
      const dayFive = data.daily[5];

      var fiveDays = [dayOne, dayTwo, dayThree, dayFour, dayFive];

      for (let index = 0; index < fiveDays.length; index++) {
        var boxes = document.createElement("div");
        boxes.classList.add("fivedaybox");
        fiveDayEl.append(boxes);

        var fiveDates = moment(fiveDays[index].dt * 1000).format(
          "MMMM Do YYYY"
        );
        var textFiveDay = document.createElement("p");
        textFiveDay.textContent = fiveDates;
        boxes.append(textFiveDay);

        var fiveDayTemp = fiveDays[index].temp.day;
        var todaysTemp = document.createElement("p");
        todaysTemp.textContent = fiveDayTemp;
        boxes.append(todaysTemp);

        var fiveDayHum = fiveDays[index].humidity;
        var todaysHum = document.createElement("p");
        todaysHum.textContent = fiveDayHum;
        boxes.append(todaysHum);

        var fiveDayWind = fiveDays[index].wind_speed;
        var todaysWind = document.createElement("p");
        todaysWind.textContent = fiveDayWind;
        boxes.append(todaysWind);
      }
    });
}
function getLocalStorage() {
  var citiesSearched = JSON.parse(localStorage.getItem("citiesSearched")) || [];
  console.log(citiesSearched);
  searchContainer.innerHTML = "";
  for (let index = 0; index < citiesSearched.length; index++) {
    var cityButton = document.createElement("button");
    cityButton.textContent = citiesSearched[index][0];
    cityButton.classList.add("btn");
    cityButton.setAttribute("data-lat", citiesSearched[index][1]);
    cityButton.setAttribute("data-lon", citiesSearched[index][2]);
    cityButton.addEventListener("click", cityBtns);
    searchContainer.append(cityButton);
  }
}

function cityBtns(event) {
  var curry = event.target.textContent;
  var hobbs = event.target.getAttribute("data-lat");
  var allen = event.target.getAttribute("data-lon");
  dataWeather(curry, hobbs, allen);
}

//    var clearDataEl = document.querySelector('.clear-item')
//    clearDataEl.addEventListener('click', function() {
//     location.assign('index.html')
//     localStorage.clear
//    })

getLocalStorage();
