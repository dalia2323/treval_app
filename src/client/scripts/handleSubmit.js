import axios from "axios";
const form = document.querySelector("form");
const dateInp = document.querySelector("#date");
const city_error=document.querySelector("#city_error");
const cityInp = document.querySelector("#city");
const date_error=document.querySelector("#date_error");
const handleSubmit = async (e) => {
  e.preventDefault();
  //validate input
  if(!validate_inputs()){
    return;
}
  const Location = await getCity();
  const { name, lang, lat } = Location;  // Fix: use `Location` instead of `location`
  const date = dateInp.value;
  const Rdays = getRdays(date);  // Fix: pass `date` to `getRdays`
  const getWeather = await getWeather(lang, lat, Rdays);
  const { image } = await getCityPic(name);  // Fix: Await the result of `getCityPic`
  updateUI(Rdays, name, image, getWeather);
};

const getCity = async () => {
  const { data } = await axios.post("http://localhost:8000/getCity", form, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
};

const getRdays = (date) => {
  const now = new Date();
  const travelDate = new Date(date);
  const timeDifference = travelDate.getTime() - now.getTime();
  const Rdays = Math.ceil(timeDifference / (1000 * 3600 * 24));
  return Rdays;
};

const getWeather = async (lang, lat, Rdays) => {
  const { data } = await axios.post("http://localhost:8000/getWeather", {
    lat,
    lang,
    Rdays,
  });
  return data;
};

const getCityPic = async (name) => {
  const { data } = await axios.post("http://localhost:8000/getPic", {
    name,
  });
  return data;
};

const updateUI = (Rdays, city, pic, weather) => {
  document.querySelector("#Rdays").innerHTML = `
    your trip starts in ${Rdays} days from now `;
  document.querySelector(".cityName").innerHTML = `Location ${city}`;
  document.querySelector(".weather").innerHTML =
    Rdays < 7
      ? `weather is ${weather.description}`
      : `weather is expected to be :${weather.description}`;
  document.querySelector(".temp").innerHTML =
    Rdays < 7
      ? `Forecast: ${weather.temp}&deg C`
      : `temperature: ${weather.temp}&deg C`;
  //
  document.querySelector(".max-temp").innerHTML =
    Rdays > 7 ? `Max-temp :${weather.app_max_temp}&deg C` : "";
  document.querySelector(".min-temp").innerHTML =
    Rdays > 7 ? `Min-temp :${weather.app_min_temp}&deg C` : "";
  document.querySelector(".pic").innerHTML = `<img src="${pic}" alt="city pic">`;  // Fix: use `pic` instead of `Picture`
  document.querySelector(".flight_data").style.display = "block";
};

// Validate inputs (implement if necessary)
const validate_inputs = () => {
if(!cityInp.value){
    city_error.innerHTML=`you need to enter a name of city`;
    city_error.style.display="block";
    return;
}
if(!dateInp.value){
    date_error.innerHTML=`you need to enter a valid date `
    date_error.style.display="block";
    return;

}
return true;
};

export { handleSubmit };
