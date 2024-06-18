import React, { useState } from "react";
import Search from "./Search";

import WeatherForecast from "./WeatherForecast";

const WeatherDashboard = () => {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState(false);
  const [city, setCity] = useState(null);
  const [weeklyWeather, setWeeklyWeather] = useState([]);
  const apiKey = "abdaba82ee8d1a51a7c2a02e09cb7145";
  const [curr, setCurr] = useState(false);

  return (
    <div className="weather-data" style={{ textAlign: "center" }}>
      <Search
        query={query}
        setQuery={setQuery}
        setSearch={setSearch}
        curr={curr}
        setCurr={setCurr}
      />
      <WeatherForecast
        curr={curr}
        setCurr={setCurr}
        query={query}
        search={search}
        city={city}
        setCity={setCity}
        weeklyWeather={weeklyWeather}
        setWeeklyWeather={setWeeklyWeather}
        apiKey={apiKey}
      />
    </div>
  );
};

export default WeatherDashboard;
