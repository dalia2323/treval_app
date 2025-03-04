const axios=require("axios")
const getCityLoc=async(city,username){
    const {data}=await axios.get(`view-source:http://api.geonames.org/postalCodeSearchJSON?q=${city}&maxRows=10&username=${username}`);
    const{name, lat ,lng}=await data.geonames[0]
    return  {name,lat,lang}
}
module.exports={getCityLoc}