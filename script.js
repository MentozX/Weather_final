const apiKey = 'cb295836f42b83138d430ecace540a47';
let forecastData = [];
let currentIndex = 0;
let currentDayIndex = 0;
let cityName = '';

const weatherTranslations = {
    "clear sky": "czyste niebo",
    "few clouds": "małe zachmurzenie",
    "scattered clouds": "rozproszone chmury",
    "broken clouds": "pochmurno",
    "shower rain": "przelotne opady",
    "rain": "deszcz",
    "thunderstorm": "burza",
    "snow": "śnieg",
    "mist": "mgła",
    "light rain": "lekki deszcz",
    "moderate rain": "umiarkowany deszcz",
    "heavy intensity rain": "silny deszcz",
    "very heavy rain": "bardzo silny deszcz",
    "extreme rain": "ekstremalny deszcz",
    "freezing rain": "marznący deszcz",
    "light snow": "lekki śnieg",
    "heavy snow": "ciężki śnieg",
    "sleet": "deszcz ze śniegiem",
    "light shower sleet": "lekki przelotny deszcz ze śniegiem",
    "shower sleet": "przelotny deszcz ze śniegiem",
    "light rain and snow": "lekki deszcz i śnieg",
    "rain and snow": "deszcz i śnieg",
    "light shower snow": "lekki przelotny śnieg",
    "shower snow": "przelotny śnieg",
    "heavy shower snow": "ciężki przelotny śnieg",
    "smoke": "dym",
    "haze": "zamglenie",
    "sand, dust whirls": "zawirowania piasku i kurzu",
    "fog": "mgła",
    "sand": "piasek",
    "dust": "kurz",
    "volcanic ash": "popiół wulkaniczny",
    "squalls": "szkwały",
    "tornado": "tornado"
};

document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    if (city) {
        fetchWeather(city);
    }
});

document.getElementById('next-day-btn').addEventListener('click', () => {
    if (forecastData.length > 0) {
        currentDayIndex++;
        if (currentDayIndex >= forecastData.length / 8) {
            currentDayIndex = 0;
        }
        updateSliderMax();
        displayWeather(forecastData[currentDayIndex * 8]);
    }
});

document.getElementById('back-day-btn').addEventListener('click', () => {
    if (forecastData.length > 0) {
        currentDayIndex--;
        if (currentDayIndex < 0) {
            currentDayIndex = Math.floor(forecastData.length / 8) - 1;
        }
        updateSliderMax();
        displayWeather(forecastData[currentDayIndex * 8]);
    }
});

document.getElementById('time-slider').addEventListener('input', (event) => {
    if (forecastData.length > 0) {
        const hourIndex = parseInt(event.target.value);
        displayWeather(forecastData[currentDayIndex * 8 + hourIndex]);
    }
});

function fetchWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === "200") {
                forecastData = data.list;
                currentIndex = 0;
                currentDayIndex = 0;
                cityName = data.city.name;
                displayWeather(forecastData[currentIndex]);
                updateSliderMax();
            } else {
                alert('City not found');
            }
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function updateSliderMax() {
    document.getElementById('time-slider').max = 7;
}

function displayWeather(weather) {
    const icon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;
    document.getElementById('weather-icon').src = icon;
    document.getElementById('temperature').innerText = `${Math.round(weather.main.temp)}°C`;
    document.getElementById('location').innerText = cityName;
    const description = weather.weather[0].description;
    document.getElementById('description').innerText = weatherTranslations[description] || description;
    document.getElementById('time').innerText = new Date(weather.dt_txt).toLocaleString();
    document.getElementById('humidity').innerText = `Wilgotność powietrza: ${weather.main.humidity}%`;
    document.getElementById('wind-speed').innerText = `Prędkość wiatru: ${weather.wind.speed} km/h`;
}
