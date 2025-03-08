const express = require("express")
const app = express();
const cors = require("cors");

//read the json files coming to you
app.use(express.json())
app.use(express.static('dist'))

//require dotenv
require("dotenv").config()

//get the city function which get location from geoNames
const  {getCityLoc} = require("./getCityLoc")
const {getWeather} = require("./getWeather")
const {getCityPic} = require("./getCityPic")

//using cors
app.use(cors())

const port = 8000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));

//I had to fix an issue with the env file that it doesn't want to get the integers in my username so i made
// a separate const for them
const userstring = process.env.USERNAME
const usernumber = process.env.USERNUMBER
const WEATHER_KEY = process.env.WEATHER_KEY
const pixabay_key = process.env.pixabay_key
const username = userstring.concat(usernumber)


app.get("/", (req, res) => {
  res.render("index.html")
})

app.post("/getCity", async (req,res) => {
    const city = req.body.city;
    const Location= await getCityLoc(city, username)
    return res.send(Location)
   
})

// app.post("/getWeather", async (req,res) => {
//    const {lng, lat, Rdays} = req.body
//    const getWeather = await weatherTemp(lng, lat, Rdays, WEATHER_KEY)
//    return res.send(getWeather)
// })
app.post("/getWeather", async (req, res) => {
  const { lng, lat, Rdays } = req.body;
  const weatherData = await getWeather(lat, lng, Rdays, WEATHER_KEY);
  return res.send(weatherData);
});

app.post("/getPic", async (req,res) => {
  const {name} = req.body
  const Picture = await getCityPic(name, pixabay_key)
  return res.send(Picture)
})

app.listen(8000, () => console.log(`server is listening on port ${port}`))