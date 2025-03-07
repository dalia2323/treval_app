const axios=require("axios")
const getCityLoc = async (city, username) => {
    const { data } = await axios.get(`http://api.geonames.org/postalCodeSearchJSON?q=${city}&maxRows=10&username=${username}`);
    if (!data.geonames.length) {
        return { message: "No city found. Please check spelling", error: true };
    }
    const { name, lat, lng } = data.geonames[0];
    return { name, lat, lng }; 
};

module.exports={getCityLoc}