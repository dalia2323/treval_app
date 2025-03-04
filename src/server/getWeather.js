const axios=require("axios")
const getWeather=async(lat,lng,Rdays,key)=>{
if(Rdays>0 && Rdays<=7){
    const {data} = await axios.get(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&units=M&key=${key}`)
   const {weather,temp}=data.dat[0]
   const {description}=weather
   const weather_data={description,temp}
   return weather_data
}else if(Rdays>7){
    const {data} = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&units=M&days=${Rdays}&key=${key}`)
    const{weather,temp,app_max_temp,app_min_temp}=data.data[data.data.length-1]
    const{description}=weather
    weather_data={description,temp,app_max_temp,app_min_temp}
    return weather_data
}
}

module.export={
    getWeather
}