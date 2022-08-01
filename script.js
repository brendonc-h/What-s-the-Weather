var searchFormEl = document.querySelector('#city-search')
var submitBtnEl = document.querySelector('.btn')
var humidityEl = document.querySelector('#humidity')
var tempEl = document.querySelector('#temp')
var windEl = document.querySelector('#wind')
var uviIndexEl = document.querySelector('#uvi-index')
var dateEl = document.querySelector('#date')
var tempCardEl = document.querySelector('#temp-card')
var windCardEl = document.querySelector('#wind-card')
var humidityCardEl = document.querySelector('#humidity')
var iconEl = document.querySelector('#icon')
var searchContainer = document.querySelector('.card-body')
var todaysDate = moment().format('MMMM Do YY')
var fiveDayEl = document.querySelector('.fiveday-container')
var cityNameEl = document.querySelector('#city-name')

submitBtnEl.addEventListener('click', weatherApi) 


 var keyApi = "4e675af444e6adb8bb8ceccdf591aa06";

 function weatherApi(event) {
    event.preventDefault()
    fetch('http://api.openweathermap.org/geo/1.0/direct?q='+ searchFormEl.value +'&appid='+keyApi)

    
    .then((response) => response.json())
    .then((data) => {
        console.log(data);

        const lon = data[0].lon
        const lat = data[0].lat
        const name = data[0].name
       var cityButton = document.createElement("button");
       cityButton.textContent = name
       cityButton.classList.add('card-body')
       searchContainer.append(cityButton);
       cityNameEl.textContent = `${name} ${todaysDate}`



        dataWeather(lon , lat, name)
 
    })

 }
function dataWeather(lon, lat, name) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hour&units=imperial&appid=4e675af444e6adb8bb8ceccdf591aa06`)


    .then((response) => response.json()) 
    .then((data) => {
        console.log(data);
        console.log(name);
        const uvi = data.current.uvi
        const humidity = data.current.humidity
        const windSpeed = data.current.wind_speed
        const temp = data.current.temp
        const icon = data.current.weather[0].icon
        const urlIcon = "https://openweathermap.org/img/w/"+icon+".png"

        
        humidityEl.textContent = `humidity: ${humidity}`;
        tempEl.textContent = `temperature: ${temp}`;
        windEl.textContent = `windspeed: ${windSpeed}`;
        uviIndexEl.textContent = `uvi: ${uvi}`;
        iconEl.setAttribute("src", urlIcon)
        
        //fivedayforecast
        const dayOne = data.daily[1]
        const dayTwo = data.daily[2]
        const dayThree = data.daily[3]
        const dayFour = data.daily[4]
        const dayFive = data.daily[5]

        var fiveDays = [dayOne, dayTwo, dayThree, dayFour, dayFive]
  
        for (let index = 0; index < fiveDays.length; index++) {
            var fiveDates = moment(fiveDays[index].dt*1000).format('MMMM Do YYYY')
            var textFiveDay = document.createElement('p')
            textFiveDay.textContent = fiveDates
            fiveDayEl.append(textFiveDay)
            console.log(textFiveDay);

            var fiveDayTemp = fiveDays[index].temp.day
            var todaystemp = document.createElement('p')
            todaystemp.textContent = fiveDayTemp 
            fiveDayEl.append(todaystemp)
            

            
        }
        
    })
}

