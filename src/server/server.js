const axios = require('axios');
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// تحقق من متغيرات البيئة
const WEATHER_KEY = process.env.WEATHER_KEY;
const pixabay_key = process.env.PIXABAY_KEY;
const usernumber = Number(process.env.USERNUMBER);
const username = process.env.USERNAME;

// Middleware
app.use(express.json());

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:8080',
      'http://localhost:3003',
      'http://127.0.0.1:3003',
      'http://localhost:5173' // أضف منفذ الواجهة الأمامية (مثل Vite)
    ];
    
    if (process.env.NODE_ENV === 'development') {
      allowedOrigins.push('http://localhost:5173');
    }

    if (!origin || allowedOrigins.includes(origin)) {
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

// Routes
app.post("/api/getCity", async (req, res) => {
  try {
    const { city } = req.body;
    if (!city) return res.status(400).json({ error: "City parameter is required" });
    
    const encodedCity = encodeURIComponent(city);
    const url = `http://api.geonames.org/searchJSON?q=${encodedCity}&maxRows=10&username=${username}`;
    
    const response = await axios.get(url);
    
    if (response.data.status?.message) {
      throw new Error(`GeoNames Error: ${response.data.status.message}`);
    }
    
    if (!response.data.geonames?.length) {
      return res.status(404).json({ error: "City not found" });
    }

    const locationData = {
      name: response.data.geonames[0].name,
      lat: response.data.geonames[0].lat,
      lng: response.data.geonames[0].lng
    };
    
    res.json(locationData);
    
  } catch (error) {
    console.error("GeoNames API Error:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Failed to fetch location data",
      details: error.response?.data?.status?.message || error.message
    });
  }
});

// Server Setup
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});