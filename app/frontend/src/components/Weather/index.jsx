import { useEffect, useState } from "react";

import { OPENWEATHER_API_KEY } from "../../config";

import "./styles.scss";

function ShowWeather({ weatherData }) {
  const [weatherName, setWeatherName] = useState(null);
  const {
    weather,
    name,
    main: { temp, humidity },
  } = weatherData;
  const [{ main, icon }] = weather;

  useEffect(() => {
    setWeatherName(getWeatherName(main));
  }, [weatherData, main]);

  function getWeatherName(weather) {
    switch (weather) {
      case "Snow":
        return "Nieve";
      case "Thunderstorm":
        return "Tormenta";
      case "Rain":
        return "Lluvioso";
      case "Drizzle":
        return "Llovizna";
      case "Haze":
        return "Niebla";
      case "Clouds":
        return "Nuboso";
      case "Clear":
        return "Soleado";
      default:
        return "Soleado";
    }
  }

  return (
    <div className="content-wrapper">
      <img
        src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={`Tiempo en ${name}, Uruguay`}
      />
      <div className="info">
        <small>
          {getWeatherName(main)} | {temp} °C
        </small>
        <small>Humedad: {humidity}%</small>
      </div>
    </div>
  );
}

export const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loaded, setLoaded] = useState(true);

  async function fetchWeatherData(cityName) {
    setLoaded(false);
    const API = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${OPENWEATHER_API_KEY}&units=metric`;

    try {
      const response = await fetch(API);
      if (response.status === 200) {
        const data = await response.json();
        setWeatherData(data);
      } else {
        setWeatherData(null);
      }
      setLoaded(true);
    } catch (error) {
      console.log("Error fetching the weather data", error);
    }
  }

  useEffect(() => {
    fetchWeatherData("Montevideo");
  }, []);

  return (
    <div className="weather">
      {!loaded ? (
        <small>Cargando...</small>
      ) : weatherData === null ? (
        <small>¡Bienvenido!</small>
      ) : (
        <ShowWeather weatherData={weatherData} />
      )}
    </div>
  );
};
