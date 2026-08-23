# 🌤️ Weather React App

A modern and responsive weather dashboard built with **React.js** and **Tailwind CSS**. The application provides real-time weather information, city autocomplete, location-based weather, air quality data, and a 5-day forecast through public weather APIs.

## 🚀 Live Demo

**Coming soon**

## 📸 Preview

<img width="1366" height="768" alt="Screenshot (132)" src="https://github.com/user-attachments/assets/51a390c7-ed8b-42a2-af6b-4d974cb8b594" />

<img width="1366" height="768" alt="Screenshot (133)" src="https://github.com/user-attachments/assets/8949ccfb-1dfa-43fd-91fe-632a3505bc23" />

<img width="1366" height="768" alt="Screenshot (134)" src="https://github.com/user-attachments/assets/bb8565e8-af33-4b7d-86e6-f01f13119a5e" />


## ✨ Features

* 🔍 **City Search** with autocomplete suggestions
* 📍 **Current Location** weather using browser geolocation
* 🌡️ **Current Temperature** and weather conditions
* 🌧️ **5-Day Weather Forecast**
* 💨 **Wind Speed** information
* 💧 **Humidity** information
* 🌬️ **Air Quality Index (AQI)**
* 🌡️ **Feels Like Temperature**
* ☀️ **Dynamic Weather UI**
* 🌙 **Responsive design** for mobile, tablet, and desktop
* 🔄 **Celsius / Fahrenheit** unit conversion
* ⚡ **Debounced autocomplete** to reduce unnecessary API requests
* 🛡️ **Error and loading states**
* 🚫 **Race-condition handling** for weather and search requests
* 🎨 Modern glassmorphism-style interface with animations

## 🛠️ Technologies Used

* **React.js**
* **JavaScript (ES6+)**
* **Tailwind CSS**
* **React Icons**
* **Open-Meteo API**
* **OpenStreetMap Nominatim API**
* **Browser Geolocation API**
* **Vite**

## 📁 Project Structure

```text
src/
├── components/
│   ├── AQICard.jsx
│   ├── CurrentWeatherCard.jsx
│   ├── ForecastSection.jsx
│   ├── SearchBar.jsx
│   ├── SkyBackdrop.jsx
│   ├── UnitToggle.jsx
│   └── WeatherInfoGrid.jsx
│
├── hooks/
│   └── useWeather.js
│
├── utils/
│   └── weatherUtils.js
│
├── WeatherApp.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## 🔄 Application Flow

```text
User searches for a city
        ↓
SearchBar
        ↓
WeatherApp
        ↓
useWeather custom hook
        ↓
Nominatim API
        ↓
Latitude & Longitude
        ↓
Open-Meteo Weather API
        ↓
Weather + Forecast Data
        ↓
Open-Meteo Air Quality API
        ↓
Weather Dashboard
```

## 🧩 React Architecture

The application separates UI components from API and utility logic.

### `WeatherApp.jsx`

The main component that connects the different parts of the application and manages the overall weather dashboard.

### `useWeather.js`

A custom React hook responsible for weather-related API requests, loading states, errors, and weather data management.

### `weatherUtils.js`

Contains reusable weather utilities such as weather-condition mapping, AQI status handling, and temperature unit conversion.

### Components

The UI is divided into reusable components:

* `SearchBar` — city search, autocomplete, and geolocation
* `CurrentWeatherCard` — current weather information
* `ForecastSection` — 5-day forecast
* `WeatherInfoGrid` — additional weather information
* `AQICard` — air quality information
* `SkyBackdrop` — weather-based visual background
* `UnitToggle` — Celsius/Fahrenheit switching

## 🔌 APIs

### Open-Meteo

Used to retrieve:

* Current weather
* Daily forecast
* Weather conditions
* Air quality information

### OpenStreetMap Nominatim

Used for:

* City search
* Location autocomplete
* Geocoding city names into coordinates

## 💻 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sahil63604-sudo/Weather-ReactApp-git.git
```

### 2. Navigate into the project

```bash
cd Weather-ReactApp-git
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the application

Vite will provide a local development URL in the terminal, usually:

```text
http://localhost:5173
```

## 📱 Responsive Design

The application is designed to work across:

* 📱 Mobile devices
* 📲 Tablets
* 💻 Laptops
* 🖥️ Desktop screens

## 🎯 What I Learned

While building this project, I worked with:

* React component architecture
* Custom React hooks
* API integration
* Asynchronous JavaScript
* Debounced search
* Race-condition prevention
* Browser Geolocation API
* Responsive Tailwind CSS
* Reusable components
* Loading and error handling
* Git and GitHub workflow

## 👨‍💻 Author

**Sahil Kumar**

Full Stack Developer | MERN Stack

* GitHub: https://github.com/sahil63604-sudo
* LinkedIn: https://www.linkedin.com/in/sahil-kumar-mern

## 📄 License

This project is created for learning and portfolio purposes.
