# Travel App

## Overview
This project is a travel planning application that allows users to enter a city and a date to get relevant weather forecasts and images of the location. It is built with Node.js, Express, and utilizes third-party APIs for data retrieval.

## Features
- Search for a city and retrieve its location data.
- Fetch weather forecasts based on the selected date.
- Display images of the selected city.
- Validate user inputs for city and date.

## Technologies Used
- **Frontend:** HTML, JavaScript
- **Backend:** Node.js, Express.js
- **APIs:** GeoNames, Weatherbit, Pixabay
- **Build Tools:** Webpack

## Project Structure
```
src/
│── client/
│   ├── __test__/         # Unit tests
│   ├── public/          # Static assets
│   ├── scripts/         # JavaScript logic
│   ├── views/           # HTML views
│   │   ├── index.html
│   │   ├── index.js
│
│── server/
│   ├── getCityLoc.js    # Fetches city coordinates from GeoNames API
│   ├── getCityPic.js    # Retrieves images from Pixabay API
│   ├── getWeather.js    # Fetches weather forecasts from Weatherbit API
│   ├── server.js        # Main Express server setup
│
├── .env                 # Environment variables
├── .gitignore           # Ignored files
├── package.json         # Project dependencies
├── package-lock.json    # Dependency tree lock file
├── webpack.common.js    # Common Webpack configuration
├── webpack.dev.js       # Webpack development configuration
├── webpack.prod.js      # Webpack production configuration
```

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/dalia2323/treval_app.git
   cd travel-app
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3.  `.env` file and add the required API keys:
   ```sh
 GO=dalia_isleem
WEATHER_KEY=6ac4884e7e714e50ac60d29055997f2b
PIXABAY_KEY=49219850-f17b895fdf8da291b7b3d49c6

   PORT=3003
   ```
4. Start the  server:
   ```sh
   npm run dev
   ```
5. Open `http://localhost:3003` in your browser.

## API Routes
- `POST /api/getCity` → Fetches city location data.
- `POST /api/getWeather` → Retrieves weather forecast for a location.
- `POST /api/getPic` → Fetches images for a city.

## Build for Production
To create a production build, run:
```sh
npm run build
npm run start

```
This will generate optimized static assets in the `dist/` folder.

## License
This project is licensed under the MIT License.

