const API_KEY = 'AHZP645GMUU4MF5HNRQNPNUN8';
const weatherForm = document.getElementById('weather-form');
const locationInput = document.getElementById('location-input');
const loadingIndicator = document.getElementById('loading');
const weatherDisplay = document.getElementById('weather-display');
const locationName = document.getElementById('location-name');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const toggleUnitButton = document.getElementById('toggle-unit');

let isCelsius = true;
let currentWeatherData = null;

async function fetchWeather(location) {
    const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${API_KEY}`
    );
    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }
    return await response.json();
}

function processWeatherData(data) {
    const { address, currentConditions } = data;
    const { temp, conditions } = currentConditions;

    return {
        location: address,
        temperature: temp,
        description: conditions,
    };
}

function displayWeather(data) {
    locationName.textContent = data.location;
    temperature.textContent = `Temperature: ${data.temperature}°C`;
    description.textContent = `Condition: ${data.description}`;
    weatherDisplay.classList.remove('hidden');

    // Update background based on weather
    document.body.style.backgroundColor =
        data.description.toLowerCase().includes('rain')
            ? '#7092be'
            : data.description.toLowerCase().includes('cloud')
            ? '#d3d3d3'
            : '#f7d358';
}

weatherForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const location = locationInput.value.trim();

    if (!location) return;

    loadingIndicator.classList.remove('hidden');
    weatherDisplay.classList.add('hidden');

    try {
        const rawData = await fetchWeather(location);
        currentWeatherData = processWeatherData(rawData);
        displayWeather(currentWeatherData);
    } catch (error) {
        alert('Error fetching weather data: ' + error.message);
    } finally {
        loadingIndicator.classList.add('hidden');
    }
});

toggleUnitButton.addEventListener('click', () => {
    if (currentWeatherData) {
        if (isCelsius) {
            const fahrenheit = (currentWeatherData.temperature * 9) / 5 + 32;
            temperature.textContent = `Temperature: ${fahrenheit.toFixed(1)}°F`;
            toggleUnitButton.textContent = 'Switch to Celsius';
        } else {
            temperature.textContent = `Temperature: ${currentWeatherData.temperature}°C`;
            toggleUnitButton.textContent = 'Switch to Fahrenheit';
        }
        isCelsius = !isCelsius;
    }
});

async function fetchGif(description) {
    const GIPHY_API_KEY = 'lnZ3UQlrrQeyUwxkH95QFveJZuYyqByi';
    const response = await fetch(
        `https://api.giphy.com/v1/gifs/translate?api_key=${GIPHY_API_KEY}&s=${encodeURIComponent(description)}&weirdness=0`
    );

    if (!response.ok) {
        console.error('Failed to fetch GIF');
        return null;
    }

    const gifData = await response.json();
    return gifData.data.images?.downsized_medium?.url || null;
}

const gifLeftContainer = document.getElementById('gif-left');
const gifRightContainer = document.getElementById('gif-right');

async function displayWeather(data) {
    locationName.textContent = data.location;
    temperature.textContent = `Temperature: ${data.temperature}°C`;
    description.textContent = `Condition: ${data.description}`;
    weatherDisplay.classList.remove('hidden');

    // Fetch the weather-related GIF
    const gifUrl = await fetchGif(data.description);
    if (gifUrl) {
        gifLeftContainer.style.backgroundImage = `url('${gifUrl}')`;
        gifRightContainer.style.backgroundImage = `url('${gifUrl}')`;
    }
}