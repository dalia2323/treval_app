const axios = require('axios');
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Middleware لتحليل JSON
app.use(express.json());

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {

    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:8080' 
    ];
    if (process.env.NODE_ENV === 'development') {
      allowedOrigins.push('*'); }
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Static Files
app.use(express.static(path.join(__dirname, "../../dist")));

// Helper Functions
const { getCityLoc } = require("./getCityLoc");
const { getWeather } = require("./getWeather");
const { getCityPic } = require("./getCityPic");

// Environment Variables
const username = process.env.USERNAME;
const WEATHER_KEY = process.env.WEATHER_KEY;
const pixabay_key = process.env.pixabay_key;

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../dist/index.html"));
});

app.post("/api/getCity", async (req, res) => {
  try {
    const { city } = req.body;
    
    if (!city) {
      return res.status(400).json({ error: "City parameter is required" });
    }
    if (!username) {
      return res.status(500).json({ error: "GeoNames username not configured" });
    }
    
    const encodedCity = encodeURIComponent(city);
    const url = `http://api.geonames.org/postalCodeSearchJSON?q=${encodedCity}&maxRows=10&username=${username}`;

    const response = await axios.get(url);
    const response = await axios.get(url);
    
    if (response.data.status && response.data.status.message) {
      throw new Error(`GeoNames Error: ${response.data.status.message}`);
    }
    if (response.data.postalCodes.length === 0) {
      return res.status(404).json({ error: "Location not found" });
    }
    if (!response.data?.postalCodes?.length) {
      return res.status(404).json({ error: "City not found" });
    }

    const { placeName: name, lat, lng } = response.data.postalCodes[0];
    // res.json({ name, lat, lng });
    const locationData = {
      name: response.data.postalCodes[0].placeName,
      lat: response.data.postalCodes[0].lat,
      lng: response.data.postalCodes[0].lng
    };
    res.json(locationData); 
    
  } catch (error) {
    console.error("GeoNames API Error:", error);
    res.status(500).json({ 
      error: "Failed to fetch location data",
      details: error.message
    });
  }
});

app.post("/api/getWeather", async (req, res) => {
  try {
    const { lat, lng, days } = req.body;
    
    if (!lat || !lng || !days) {
      return res.status(400).json({ error: "Missing required parameters" });
    }
    
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&days=${days}&key=${WEATHER_KEY}`;
    
    const response = await axios.get(url);
    
    const weatherData = {
      temp: response.data.data[0].temp,
      description: response.data.data[0].weather.description
    };
    
    res.json(weatherData);
    
  } catch (error) {
    console.error("Weatherbit API Error:", error);
    res.status(500).json({
      error: "Failed to fetch weather data",
      details: error.message
    });
  }
});

app.post("/api/getPic", async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }
    
    const url = `https://pixabay.com/api/?key=${pixabay_key}&q=${encodeURIComponent(query)}&image_type=photo`;
    
    const response = await axios.get(url);
    
    if (response.data.hits.length === 0) {
      return res.status(404).json({ error: "No images found" });
    }
    
    const imageData = {
      url: response.data.hits[0].webformatURL,
      tags: response.data.hits[0].tags
    };
    
    res.json(imageData);
    
  } catch (error) {
    console.error("Pixabay API Error:", error);
    res.status(500).json({
      error: "Failed to fetch image data",
      details: error.message
    });
  }
});

// Server Setup
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GeoNames username: ${username}`);
  console.log(`Weatherbit key: ${WEATHER_KEY ? "***" : "Not set"}`);
  console.log(`Pixabay key: ${pixabay_key ? "***" : "Not set"}`);
});
console.log(`Request to GeoNames: ${url}`);