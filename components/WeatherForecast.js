import React, { useEffect, useState } from "react";

const WeatherForecast = ({
  query,
  city,
  setCity,
  weeklyWeather,
  setWeeklyWeather,
  apiKey,
  curr,
}) => {
  const [state, setState] = useState("Loading...");
  const [forecast, setForecast] = useState("5-Day Forecast");
  useEffect(() => {
    const fetchData = async () => {
      if (query) {
        try {
          const currentWeatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`
          );
          const currentWeatherData = await currentWeatherResponse.json();
          setCity(currentWeatherData);
          setState("Please enter the valid city");
          setForecast("");
          if (currentWeatherData.cod === 200 && currentWeatherData.coord) {
            setForecast("5-Day Forecast");
            const { lat, lon } = currentWeatherData.coord;
            const forecastResponse = await fetch(
              `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
            );
            const forecastData = await forecastResponse.json();
            setWeeklyWeather(
              forecastData.list.filter((cur, index) => index % 8 === 0)
            );
          }
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      }
    };

    fetchData();
  }, [query]);

  if (curr == true || curr == false) {
    useEffect(() => {
      fetch("http://ip-api.com/json")
        .then((res) => res.json())
        .then((data) => {
          return fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${data.city}&appid=${apiKey}&units=metric`
          );
        })
        .then((res) => res.json())
        .then((data) => {
          setCity(data);
          const { lat, lon } = data.coord;
          return fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
          );
        })
        .then((res) => res.json())
        .then((data) =>
          setWeeklyWeather(data.list.filter((cur, index) => index % 8 === 0))
        );
    }, [curr]);
  }

  return (
    <div className="weatherContainer">
      {city && city.cod === 200 ? (
        <>
          <div className="weatherHeader">
            <h3>Current Weather in {city.name}</h3>
          </div>
          <div className="currentWeather">
            <div className="weatherInfo">
              <h4>Temperature: {city.main.temp}°C</h4>
              <h4>Humidity: {city.main.humidity}%</h4>
              <h4>Description: {city.weather[0].description}</h4>
            </div>
            <img
              className="weatherIcon"
              src={`https://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`}
              alt="weather icon"
            />
          </div>
        </>
      ) : (
        <h3>{state}</h3>
      )}

      <div className="forecastContainer">
        <h3 className="weatherHeader">{forecast}</h3>
        {city && city.cod === 200
          ? weeklyWeather.map((weather, index) => (
              <>
                <div key={index} className="forecastEntry">
                  <h4>
                    {new Date(weather.dt * 1000).toDateString()},{" "}
                    {weather.main.temp}
                    °C, {weather.weather[0].description}
                  </h4>
                  <img
                    className="forecastIcon"
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt="weather icon"
                  />
                </div>
              </>
            ))
          : ""}
      </div>
    </div>
  );
};

export default WeatherForecast;
