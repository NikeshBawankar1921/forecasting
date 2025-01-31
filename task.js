
const API_KEY = "84f53890008154b0387bc052636044d0"; //api key unique for each user.
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const cityInput = document.getElementById("cityInput");
const errorMsg = document.getElementById("errorMsg");
const recentCities = document.getElementById("recentCities");
var h=0;
// ✅ Log to check if JS is running
console.log("Script loaded successfully");

const fetchWeather = async (city) => {
    errorMsg.classList.add("hidden");
    try {
        console.log(`Fetching weather for: ${city}`);

        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if (!res.ok) throw new Error(alert("Sorry, City not found! Contact Nikesh!!")); 
        const data = await res.json();

        document.getElementById("temperature").innerText = `${data.main.temp}°C`;
        document.getElementById("humidity").innerText = `Humidity: ${data.main.humidity}%`;
        document.getElementById("temp").innerText = `${data.main.temp}°C`;
        document.getElementById("humidityDetail").innerText = `${data.main.humidity}%`;
        document.getElementById("windSpeed").innerText = `${data.wind.speed} km/h`;
        document.getElementById("weatherCondition").innerText = data.weather[0].main;
        document.getElementById("weatherIcon").innerText = getWeatherIcon(data.weather[0].main);

        saveRecentCity(city);
        fetchForecast(city);
    } catch (error) {
        console.error(error);
        errorMsg.innerText = error.message;
        errorMsg.classList.remove("hidden");
    }
};

const fetchForecast = async (city) => {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await res.json();

        const forecastContainer = document.getElementById("forecast");
        forecastContainer.innerHTML = "";
        for (let i = 0; i < data.list.length; i += 8) {
            const day = data.list[i];
            forecastContainer.innerHTML += `
                <div class="bg-white/30 backdrop-blur-md shadow-md p-4 rounded-xl text-center">
                    <p class="text-lg">${new Date(day.dt_txt).toLocaleDateString()}</p>
                    <p class="text-3xl">${getWeatherIcon(day.weather[0].main)}</p>
                    <p class="text-xl font-semibold text-gray-800">${day.main.temp}°C</p>
                </div>`;
        }
    } catch (error) {
        console.error("Error fetching forecast:", error);
    }
};

const getWeatherIcon = (condition) => {
    const icons = {
        Clear: "☀️",
        Clouds: "☁️",
        Rain: "🌧️",
        Thunderstorm: "⛈️",
        Snow: "❄️",
        Mist: "🌫️",
    };
    return icons[condition] || "🌥️";
};

const saveRecentCity = (city) => {
    let cities = JSON.parse(localStorage.getItem("recentCities")) || [];
    if (!cities.includes(city)) {
        cities.unshift(city);}
        if (cities.length > 5) {cities.pop();
        localStorage.setItem("recentCities", JSON.stringify(cities));
    }
    if(h=0){
    updateRecentCities();}
};

const updateRecentCities = () => {
    let cities = JSON.parse(localStorage.getItem("recentCities")) || [];
    recentCities.innerHTML = cities.map(city => `<option value="${city}">${city}</option>`).join("");
    recentCities.classList.toggle("hidden", cities.length === 0);
};

// ✅ Search by city name
searchBtn.addEventListener("click", () => { h=0;
    if (!cityInput.value.trim()) {
        errorMsg.innerText = "Please enter a city name!";
        errorMsg.classList.remove("hidden");
    } else {
        fetchWeather(cityInput.value.trim());
    }
    updateRecentCities();
});

// ✅ Get current location weather
locationBtn.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeather(`${latitude},${longitude}`);
        },
        () => {
            errorMsg.innerText = "Location access denied!";
            errorMsg.classList.remove("hidden");
        }
    );
});

// ✅ Load recent cities on page load
updateRecentCities();

if(recentCities.addEventListener){
    h=1;
    recentCities.addEventListener("change",(event)=>{pop(event.target.value)})
    recentCities.addEventListener("change",(event)=>{fetchWeather(event.target.value)})
    
}
