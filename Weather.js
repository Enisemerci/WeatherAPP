const cityInput=document.querySelector(".city-input");
const searchButton =document.querySelector(".search-btn");
const currentWeatherDiv=document.querySelector(".current-weather");
const weatherCardsDiv=document.querySelector(".weather-cards");

const API_KEY='3b02083a173c9f5cc9f48fd76c7157b9';

const createWeatherCard=(cityName,weatherItem,index)=>{
    if(index===0){
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h6>Temperature:${(weatherItem.main.temp-273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity} %</h6>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;

    }else{
        return `<li class="card">
                    <h2>(${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                    <h6>Temperature:${(weatherItem.main.temp-273.15).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity} %</h6>
                </li>`;
        }
}

const getWeatherDetails=(cityName,lat,lon)=>{
    const WEATHER_API_URL=`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res=>res.json()).then(data=>{
        const uniqueForecastDays=[];
        const fiveDaysForecast=data.list.filter(forecast=>{
            const forecastDate=new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        });
        cityInput.value="";
        weatherCardsDiv.innerHTML="";
        currentWeatherDiv.innerHTML="";

        
        fiveDaysForecast.forEach((weatherItem,index)=>{
            if(index===0){
                currentWeatherDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName,weatherItem,index));
            }else{
                weatherCardsDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName,weatherItem,index));
            }
        });
    }).catch(()=>{
        alert("An error occured while fetching the Weather Forecast");

    });

}

const getCityCoordinates=()=>{
    const cityName=cityInput.value.trim();//remove extra spaces
    if(cityName==="")return;
    const  API_URL=`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(API_URL).then(res=>res.json()).then(data=>{
        if(!data.length)return alert(`No coordinates found for ${cityName}`);
        const {name,lat,lon}=data[0];
        getWeatherDetails(name,lat,lon);
    }).catch(()=>{
        alert("An error occured while fetching the coodinates");

    });
}

searchButton.addEventListener("click", getCityCoordinates);