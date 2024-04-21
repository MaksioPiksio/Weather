"use strict";

let dayNavFlag0 = 1;
let dayNavFlag1 = 0;
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const weatherIcons = ['sun','clouds','wind','haze','partly-cloudy-day','rain','snow','storm'];
const body = document.querySelector('body');
const theme = document.querySelector('.theme');
const themeIcon = document.querySelector('.theme-icon');
const dayNameday = document.querySelectorAll('.day-name-day');
const dayNameDate = document.querySelector('.day-name-date');
const city = document.querySelector('.city');
const country = document.querySelector('.country');
const daytemp = document.querySelectorAll('.day-temp');
const dayWeatherIcon = document.querySelectorAll('.day-weather-icon');
const dayTempDetiled = document.querySelectorAll('.day-temp-detiled');
const daySun = document.querySelectorAll('.day-sun');
const dayNav = document.querySelectorAll('.day-nav');
const rainWeekDays = document.querySelectorAll('.rain-week-days');
const rainChart = document.querySelectorAll('.rain-chart');

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition( 
        (position) => {
            let lat = position.coords.latitude;
            let lng = position.coords.longitude;

            getCityFromCoordinates(lat,lng);
            getWeekWeather(lat,lng);
            getRain(lat,lng);
        },
        (error) => {
            console.error("Error getting user location:", error);
        }
    );
}else{
    console.error("Geolocation is not supported by this browser.");
}

const getWeekWeather = async (lat,lng) => {
    try{
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,surface_pressure,relativehumidity_2m,apparent_temperature,windspeed_10m,winddirection_10m,temperature_1000hPa&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=Europe%2FBerlin`);
        const data = await res.json();

        for(let i = 0; i < 7; i++){
            let avrTemp = 0;
            for(let j = 24*i; j < 24 * (i+1); j++){
                avrTemp += data.hourly.temperature_2m[j];
            }
            avrTemp = Math.round(avrTemp/24);
            daytemp[i].innerHTML = `${avrTemp}°`;
        }

        for(let i = 0; i < 7; i++){
            let kod = data.daily.weathercode[i];
            dayWeatherIcon[i].innerHTML = `<img src="img/weather-icons/icons8-${weatherIcons[getValue(kod,iconTest)]}-96.png">`
        }

        dayTempDetiled[0].innerHTML =
        `Real feel: <span style="color:black">${data.hourly.apparent_temperature[0]}°<br></span>
        Wind: <span style="color:black">${data.hourly.windspeed_10m[0]} km/h<br></span>
        Pressure: <span style="color:black">${Math.round(data.hourly.surface_pressure[0])}hPa<br></span>
        Humidity: <span style="color:black">${data.hourly.relativehumidity_2m[0]}%<br></span>`

        daySun[0].innerHTML =
        `Sunrise: <span style="color:black">${data.daily.sunrise[0].slice(-5)}<br></span>
        Sunset: <span style="color:black">${data.daily.sunset[0].slice(-5)}</span>`

        dayTempDetiled[1].innerHTML =
        `Real feel: <span style="color:black">${data.hourly.apparent_temperature[1]}°<br></span>
        Wind: <span style="color:black">${data.hourly.windspeed_10m[1]} km/h<br></span>
        Pressure: <span style="color:black">${Math.round(data.hourly.surface_pressure[1])}hPa<br></span>
        Humidity: <span style="color:black">${data.hourly.relativehumidity_2m[1]}%<br></span>`

        daySun[1].innerHTML =
        `Sunrise: <span style="color:black">${data.daily.sunrise[1].slice(-5)}<br></span>
        Sunset: <span style="color:black">${data.daily.sunset[1].slice(-5)}</span>`

    }catch(err){
        console.error(err)
    }
}
const getCityFromCoordinates = async (lat, lng) =>{
    try{
        const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`)
        const data = await res.json();
        city.innerHTML = data.city+`,&nbsp;`;
        country.innerHTML = data.countryCode;

    } catch (err){
        console.error(err);
    }

}
const getRain = async (lat, lng) =>{
    try{
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=precipitation_probability_max&timezone=Europe%2FBerlin`)
        const data = await res.json();
        let height = document.querySelector('.rain-chart').clientHeight/100;
        for(let i = 0; i < 7; i++){
            rainChart[i].style.marginTop = `${(100-data.daily.precipitation_probability_max[i])*height}px`;
            rainChart[i].style.height = `${data.daily.precipitation_probability_max[i]}%`;
        }
    } catch (err){
        console.error(err);
    }
}
const time = () => {
    let date = new Date();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    if (minutes<10) {
        minutes = `0${minutes}`;
    }
    if (hour<10) {
        hour = `0${hour}`;
    }
    dayNameDate.innerHTML = `${hour}:${minutes}`;
}
const day = () => {
    let date = new Date();
    let day = date.getDay()-1;
    for (let i = 0; i < days.length; i++) {
        if (day+i > 6) {
            day = -i;
        }
        if(dayNavFlag0 === 1){
            if(i===0){
                dayNameday[i].innerHTML = days[day+i];
            }else{
                dayNameday[i].innerHTML = days[day+i].slice(0,3);
            }
        }else if(dayNavFlag1 === 1){
            if(i===1){
                dayNameday[i].innerHTML = days[day+i];
            }else{
                dayNameday[i].innerHTML = days[day+i].slice(0,3);
            }
        }
        rainWeekDays[i].innerHTML = days[day+i].slice(0,3);
    }

}
const iconTest = {
    1: [13,14,15,16],
    2: [18,19],
    3: [4,5,6,7,8,9,10,11,12,28,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49],
    4: [0,1,2,3],
    5: [20,21,24,25,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,80,81,82,83,84,91,92,93],
    6: [22,23,26,27,70,71,72,73,74,75,76,77,78,79,85,86,87,88,89,90,94],
    7: [17,29,95,96,97,98,99]
};
const getValue = (input,map) => {
    for (const [key,value] of Object.entries(map)) {
        if (value.includes(input)) {
            return key;
        }
    }
}

dayNav[0].addEventListener('click', () => {
    if(dayNavFlag0 === 1){
    }else if(dayNavFlag0 ===0){
    body.classList.toggle('second-day');
    dayNav[0].classList.toggle('day-nav-active');
    dayNav[1].classList.toggle('day-nav-active');
    dayNavFlag1 = 0;
    dayNavFlag0 = 1;
    day();
    }
})
dayNav[1].addEventListener('click', () => {
    if(dayNavFlag1 === 1){
    }else if(dayNavFlag1 ===0){
    body.classList.toggle('second-day');
    dayNav[0].classList.toggle('day-nav-active');
    dayNav[1].classList.toggle('day-nav-active');
    dayNavFlag0 = 0;
    dayNavFlag1 = 1;
    day();
    }
})
theme.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    body.classList.toggle('light-theme');
    themeIcon.classList.toggle('fa-sun');
    themeIcon.classList.toggle('fa-moon');
});

setInterval(time, 1000);
day();