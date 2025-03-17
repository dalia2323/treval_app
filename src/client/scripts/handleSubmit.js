import axios from "axios";
import { getRemainingDays } from "./daysLeft";

const formElement = document.querySelector("#travelForm");
const cityInput = document.getElementById("city");
const dateInput = document.getElementById("date");
const errorCity = document.getElementById("city_error");
const errorDate = document.getElementById("date_error");

const handleSubmit = async (event) => {
  event.preventDefault();

  resetErrors();

  const cityName = cityInput.value.trim();
  const travelDate = dateInput.value;

  if (!cityName) {
    displayError(errorCity, "Please provide the city you plan to visit.");
    return;
  }

  const daysLeft = calculateDaysRemaining(travelDate);

  if (daysLeft < 0) {
    displayError(errorDate, "The travel date cannot be in the past.");
    return;
  }

  try {
    const cityData = await fetchCityData(cityName);
    if (cityData.error) {
      displayError(errorCity, cityData.error);
      return;
    }

    const weatherDetails = await retrieveWeatherInfo(cityData, daysLeft);
    if (weatherDetails.error) {
      displayError(errorDate, weatherDetails.error);
      return;
    }

    const imageURL = await fetchCityImage(cityData.name);

    updateTripDetails(cityData.name, daysLeft, weatherDetails, imageURL);

  } catch (err) {
    console.error("Unexpected error:", err);
  }
};

// إرفاق مستمع الحدث بوضوح
document.addEventListener('DOMContentLoaded', () => {
  formElement.addEventListener('submit', handleSubmit);
});

// دوالك المساعدة

const fetchCityData = async (city) => {
  try {
    const response = await axios.post("http://localhost:3003/api/getCity", { city });
    return response.data;
  } catch {
    return { error: "Unable to find city information." };
  }
};

const retrieveWeatherInfo = async ({ lat, lng }, daysAhead) => {
  try {
    const { data } = await axios.post("http://localhost:3003/api/getWeather", {
      lat,
      lng,
      Rdays: daysAhead,
    });
    return data;
  } catch {
    return { error: "Couldn't retrieve weather data." };
  }
};

const fetchCityImage = async (cityName) => {
  try {
    const response = await axios.post(
      "http://localhost:3003/api/getPic",
      { name: cityName },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data.image;
  } catch (error) {
    console.error("Image fetch error:", error.response?.data || error.message);
    return "https://source.unsplash.com/random/640x480?travel";
  }
};

const updateTripDetails = (city, days, weather, imgSrc) => {
  document.querySelector("#Rdays").textContent = `Only ${days} days until your adventure!`;
  document.querySelector(".cityName").textContent = `Destination: ${city}`;
  document.querySelector(".weather").textContent = `Forecast: ${weather.description}`;
  document.querySelector(".temp").innerHTML = `Current Temp: ${weather.temp}&deg;C`;

  document.querySelector(".max-temp").innerHTML = days > 7 ? `High: ${weather.app_max_temp}&deg;C` : "";
  document.querySelector(".min-temp").innerHTML = days > 7 ? `Low: ${weather.app_min_temp}&deg;C` : "";

  document.querySelector(".pic").innerHTML = `<img src="${imgSrc}" alt="Destination Image">`;
  document.querySelector(".flight_data").style.display = "block";
};

const calculateDaysRemaining = (futureDate) => {
  const today = new Date().setHours(0,0,0,0);
  const targetDate = new Date(futureDate).setHours(0,0,0,0);
  return Math.round((targetDate - today) / (1000 * 60 * 60 * 24));
};

const displayError = (element, message) => {
  element.textContent = message;
  element.style.display = "block";
};

const resetErrors = () => {
  [errorCity, errorDate].forEach(err => {
    err.textContent = "";
    err.style.display = "none";
  });
};

// التصدير الصحيح والواضح
export { handleSubmit };
