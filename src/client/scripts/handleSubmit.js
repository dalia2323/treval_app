import axios from "axios";
import { getRdays } from './getRdays.js'; 

const form = document.querySelector("form");
const dateInp = document.querySelector("#date");
const city_error = document.querySelector("#city_error");
const cityInp = document.querySelector("#city");
const date_error = document.querySelector("#date_error");

const handleSubmit = async (e) => {
  e.preventDefault();
  //validate input
  if (!validate_inputs()) {
    return;
  }

  const Location = await getCity();
  if (Location.error) {
    city_error.textContent = `${Location.error}`;
    city_error.style.display = "block";
    return;
  }
  city_error.style.display = "none";

  const { name, lang, lat } = Location; 
  const date = dateInp.value;
  const Rdays = getRdays(date);  

  if (Rdays < 0) {
    date_error.textContent = `Date cannot be in the past`;
    date_error.style.display = "block";
    return;
  }
  date_error.style.display = "none";

  const getWeather = await getWeather(lang, lat, Rdays);
  if (getWeather.error) {
    date_error.textContent = `${getWeather.message}`;
    date_error.style.display = "block";
    return;
  }
  date_error.style.display = "none";

  const { image } = await getCityPic(name); 
  updateUI(Rdays, name, image, getWeather);
};

// const getCity = async () => {
//   const city = document.querySelector("#city").value;
//   const { data } = await axios.post("http://localhost:3003/api/getCity", { city }, {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   return data;
// };

const fetchWeather = async (lang, lat, Rdays) => { // ← غير الاسم
  const { data } = await axios.post("http://localhost:3003/api/getWeather", {
    lat,
    lang,
    Rdays,
  });
  return data;
};

const getCityPic = async (name) => {
  const { data } = await axios.post("http://localhost:3003/api/getPic", {
    name,
  });
  return data;
};
const getCity = async () => {
  const city = document.querySelector("#city").value;
  if (!city) return;

  try {
    const { data } = await axios.post("http://localhost:3003/api/getCity", { city });
    return data;
  } catch (error) {
    console.error("Error fetching city:", error.response?.data);
    throw error;
  }
};
const updateUI = (Rdays, city, pic, weather) => {
  document.querySelector("#Rdays").innerHTML = `Your trip starts in ${Rdays} days.`;
  document.querySelector(".cityName").textContent = `Location: ${city}`;
  document.querySelector(".weather").textContent = `Weather: ${weather.description}`;
  document.querySelector(".temp").innerHTML = `Temperature: ${weather.temp}&deg; C`;

  if (Rdays > 7) {
    document.querySelector(".max-temp").innerHTML = `Max Temp: ${weather.app_max_temp}&deg; C`;
    document.querySelector(".min-temp").innerHTML = `Min Temp: ${weather.app_min_temp}&deg; C`;
  } else {
    document.querySelector(".max-temp").innerHTML = "";
    document.querySelector(".min-temp").innerHTML = "";
  }

  document.querySelector(".pic").innerHTML = `<img src="${pic}" alt="City Image">`;
  document.querySelector(".flight_data").style.display = "block";
};

// Validate inputs
const validate_inputs = () => {
  city_error.style.display = "none";
  date_error.style.display = "none";
  if (!cityInp.value) {
    city_error.innerHTML = `You need to enter a name of city`;
    city_error.style.display = "block";
    return;
  }
  if (!dateInp.value) {
    date_error.innerHTML = `You need to enter a valid date`;
    date_error.style.display = "block";
    return;
  }
  if (getRdays(dateInp.value) < 0) {
    date_error.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i> Date can't be in the past`;
    date_error.style.display = "block";
    return;
  }
  return true;
};
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('travelForm');
  form.addEventListener('submit', handleSubmit);
});
export { handleSubmit };
