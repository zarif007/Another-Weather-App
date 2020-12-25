const API_KEY = '';
document.querySelector('#cardll').style.display = 'none';

//Storing weather data
class WeatherData{
    constructor(cityName, description){
        this.cityName = cityName;
        this.description = description;
        this.temperature = '';
    }
};


//Reflecting Api
const WEATHER_PROXY_HANDLER = {
    get : function(target, property) {
        return Reflect.get(target, property);
    },
    set : function(target, property, value) {
        const newValue = (value).toFixed(2) + '° C.';
        return Reflect.set(target, property, newValue);
    }
};

//Fetching data 
class http {
    static fetchData(url) {
        return new Promise((resolve, reject) => {
            const HTTP = new XMLHttpRequest();
            HTTP.open('GET', url);
            HTTP.onreadystatechange = function(){
                if (HTTP.readyState == XMLHttpRequest.DONE && HTTP.status == 200){
                    const RESPONSE_DATA = JSON.parse(HTTP.responseText);
                    resolve(RESPONSE_DATA);
                } else if(HTTP.readyState == XMLHttpRequest.DONE){
                    console.log('ll');
                    reject('wait');
                }
            };
            HTTP.send();
        });
    }
}

//Connecting to Backend using api 
document.querySelector("button").addEventListener("click", function myFunction(){
    const CITY_NAME = document.querySelector("#city").value.trim();
    if(CITY_NAME.length == 0){
        return alert('please enter a city name');
    }
    
    const URL = `http://api.openweathermap.org/data/2.5/weather?q=${CITY_NAME}&units=metric&appid=${API_KEY}`;

    http.fetchData(URL)
        .then(responseData => {
            const WEATHER_DATA = new WeatherData(CITY_NAME, responseData.weather[0].description.toUpperCase());
            const WEATHER_PROXY = new Proxy(WEATHER_DATA, WEATHER_PROXY_HANDLER);
            WEATHER_PROXY.temperature = responseData.main.temp;
            updateWeather(WEATHER_PROXY);
        })
        .catch(error => alert(error));
}); 

//Displaying on interface
function updateWeather(weatherData){
    
    document.querySelector('#weather').firstElementChild.textContent = weatherData.cityName;
    document.querySelector('#weatherDescription').textContent = weatherData.description;
    document.querySelector('#weather').lastElementChild.textContent = weatherData.temperature;


    //changing backgroud according to weather
    if(weatherData.description.includes('HAZE')){
        document.querySelector('#img').src = 'image/haze.jpg';
        document.body.style.background = "#f3f3f3 url('image/haze-bg.png') no-repeat right top";

    } else if(weatherData.description.includes('MIST')){
        document.querySelector('#img').src = 'image/mist.png';
        document.body.style.background = "#f3f3f3 url('image/mist-bg.png') no-repeat right top";

    } else if(weatherData.description.includes('CLOUDS')){
        document.querySelector('#img').src = 'image/clouds.jpg';
        document.body.style.background = "#f3f3f3 url('image/clouds-bg.png') no-repeat right top";

    } else if(weatherData.description.includes('CLEAR')){
        document.querySelector('#img').src = 'image/clear sky.jpg';
        document.body.style.background = "#f3f3f3 url('image/clearsky-bg.png') no-repeat right top";

    } else if(weatherData.description.includes('SNOW')){
        document.querySelector('#img').src = 'image/snow.jpg';
        document.body.style.background = "#f3f3f3 url('image/snow-bg.png') no-repeat right top";

    } 
    
    document.querySelector('#cardll').style.display = 'block';  
}