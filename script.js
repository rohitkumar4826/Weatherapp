document.getElementById("Toggle").addEventListener("click", async () => {
  var word = document.getElementById("Toggle").innerHTML;
  if (word == "Celcius") {
    document.getElementById("Toggle").innerHTML = "Farenheit";
    document.getElementById("sign").innerHTML = "&#8451;";
  } else {
    document.getElementById("Toggle").innerHTML = "Celcius";
    document.getElementById("sign").innerHTML = "&#8457;";
  }
  document.getElementById("getWeatherBtn").click();
});
document
  .getElementById("getWeatherBtn")
  .addEventListener("click", async function weatherdata() {
    console.log("weather button clicked");
    const cityName = document.getElementById("cityInput").value;
    if (cityName === "") {
      window.location.reload();
    }
    let unit = document.getElementById("Toggle").innerHTML;
    try {
      const currentWeatherResponse = await fetch("/currentWeather", {
        method: "post",
        body: new URLSearchParams({ city: cityName, units: unit }),
      });
      const currentWeatherData = await currentWeatherResponse.json();
      console.log(currentWeatherData);

      const forecastResponse = await fetch(`/forecast?city=${cityName}`);
      const forecastData = await forecastResponse.json();
      console.log(forecastData);
      document.getElementById("currentTemp").textContent =
        currentWeatherData.main.temp;
      document.getElementById("currentspeed").textContent =
        currentWeatherData.wind.speed;
      document.getElementById("currentHumidity").textContent =
        currentWeatherData.main.humidity;
      document.getElementById("currentDescription").textContent =
        currentWeatherData.weather[0].description;
      const weatherDescription = currentWeatherData.weather[0].description;
      // Set the weather icon based on the description
      const weatherIcon = document.getElementById("weatherIcon");
      weatherIcon.src = getWeatherIconURL(weatherDescription);

      const averageTemp = calculateAverageTemperature(forecastData.list);
      document.getElementById("averageTemp").textContent = averageTemp;
      displayForecast(forecastData.list);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Enter valid location");
      window.location.reload();
    }
  });
// Mapping of weather descriptions to icon filenames
const weatherIcons = {
  "clear sky": "clear-sky.png",
  "few clouds": "few-clouds.png",
  "scattered clouds": "scattered-clouds.png",
  "broken clouds": "broken-clouds.png",
  "shower rain": "shower-rain.png",
  "rain": "rain.png",
  "thunderstorm": "thunderstorm.png",
  "snow": "snow.png",
  "mist": "mist.png",
  "fog": "fog.png",
  "hot": "hot.png",
};
function getWeatherIconURL(description) {
  const lowerCaseDescription = description.toLowerCase();
  return weatherIcons[lowerCaseDescription] || "default-icon.png"; // Provide a default icon
}

function calculateAverageTemperature(forecastList) {
  var sum = 0;

  for (var i = 2; i < 40; i += 8) {
    sum += forecastList[i].main.temp;
  }
  var avg = sum / 5;
  return avg.toFixed(2);
}
// For the forecaste data of API

function displayForecast(forecastList) {
  const forecastDataContainer = document.getElementById("forecastData");

  forecastDataContainer.innerHTML = "";

  for (let i = 2; i < 40; i += 8) {
    const forecast = forecastList[i];

    const forecastElement = document.createElement("div");
    forecastElement.classList.add("forecast-item");

    const dateElement = document.createElement("p");
    dateElement.textContent = `Date: ${forecast.dt_txt.split(" ")[0]}`;
    const tempElement = document.createElement("p");
    tempElement.textContent = `Temperature: ${forecast.main.temp} C`;

    forecastElement.appendChild(dateElement);
    forecastElement.appendChild(tempElement);

    forecastDataContainer.appendChild(forecastElement);
  }
}
