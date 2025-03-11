const axios = require('axios');
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
require("dotenv").config();


// تحقق من متغيرات البيئة

const WEATHER_KEY = process.env.WEATHER_KEY;
const pixabay_key =process.env.PIXABAY_KEY;
const usernumber = Number(process.env.USERNUMBER);
const username = process.env.USERNAME;
// const username = userstring.concat(String(usernumber));

console.log("USERNAME:", process.env.USERNAME);
console.log("USERNUMBER:", process.env.USERNUMBER);
console.log(typeof process.env.USERNUMBER); // هل يطبع "string" أو "number"؟

console.log("GeoNames Username: ", username);  // هنا تطبع المتغير من الخادم

console.log(typeof usernumber); // تأكدي أنه يطبع "number"

if (!username || !WEATHER_KEY || !pixabay_key) {
  console.error('Missing environment variables!');
  process.exit(1);
}

// Middleware
app.use(express.json());
console.log("NODE_ENV:", process.env.NODE_ENV);

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:8080'
    ];
    
    if (process.env.NODE_ENV === 'development') {
      allowedOrigins.push(
        'http://localhost:3003',
        'http://127.0.0.1:3003'
      );
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
app.use(cors({
  origin: "*", 
  credentials: true
}));


// Static Files
app.use(express.static(path.join(__dirname, "../../dist")));

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../dist/index.html"));
});

app.post("/api/getCity", async (req, res) => {
  console.log("Received request body:", req.body); 
  try {
    const { city } = req.body;
    
    if (!city) return res.status(400).json({ error: "City parameter is required" });
    
    const encodedCity = encodeURIComponent(city);
    // const url = `http://api.geonames.org/postalCodeSearchJSON?q=${encodedCity}&maxRows=10&username=${username}`;
    const url = `http://api.geonames.org/postalCodeSearchJSON?placename=${encodeURIComponent(city)}&maxRows=10&username=${username}`;

    const response = await axios.get(url);
    
    if (response.data.status?.message) {
      throw new Error(`GeoNames Error: ${response.data.status.message}`);
    }
    
    if (!response.data.postalCodes?.length) {
      return res.status(404).json({ error: "City not found" });
    }

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


// Error Handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Server Setup
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GeoNames username: ${username}`);
  console.log(`Weatherbit key: ${WEATHER_KEY ? "***" : "Not set"}`);
  console.log(`Pixabay key: ${pixabay_key ? "***" : "Not set"}`);
});