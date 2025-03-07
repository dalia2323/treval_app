const axios = require("axios");

const getWeather = async (lat, lng, Rdays, key) => {
    if (!Rdays || Rdays < 0) {
        return { message: "Please enter a valid date", error: true };
    }

    if (Rdays <= 7) {
        const { data } = await axios.get(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&units=M&key=${key}`);
        const { weather, temp } = data.data[0]; 
        return { description: weather.description, temp };
    } else {
        const { data } = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&units=M&days=${Rdays}&key=${key}`);
        const { weather, temp, app_max_temp, app_min_temp } = data.data[data.data.length - 1];
        return { description: weather.description, temp, app_max_temp, app_min_temp };
    }
};

module.exports = { getWeather }; 
