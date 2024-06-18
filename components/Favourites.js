import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Favourites = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentCityId, setCurrentCityId] = useState(null);
  const [newCityName, setNewCityName] = useState("");
  const navigate = useNavigate();
  const apiKey = "abdaba82ee8d1a51a7c2a02e09cb7145";

  const openModal = (id) => {
    setCurrentCityId(id);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentCityId(null);
    setNewCityName("");
  };

  const handleInputChange = (e) => {
    setNewCityName(e.target.value);
  };

  const handleUpdate = () => {
    if (currentCityId && newCityName.trim()) {
      updateHandler(currentCityId, newCityName);
      closeModal();
    }
  };

  async function updateHandler(id, city) {
    try {
      const newData = {
        city: city,
      };

      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      };

      const response = await fetch(
        `https://wdatadetails.onrender.com/favCities/${id}`,
        options
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${data.city}&appid=${apiKey}&units=metric`
      );

      if (!weatherResponse.ok) {
        throw new Error(`Failed to fetch weather data for ${data.city}`);
      }

      const updatedWeatherData = await weatherResponse.json();

      setWeatherData((prevWeatherData) =>
        prevWeatherData.map((cur) =>
          cur.id === id ? { ...updatedWeatherData, id: cur.id } : cur
        )
      );
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  const deleteHandler = async (id) => {
    try {
      await fetch(`https://wdatadetails.onrender.com/favCities/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      setWeatherData((prevData) => prevData.filter((city) => city.id !== id));
    } catch (error) {
      console.error("There was a problem with the delete operation:", error);
    }
  };

  useEffect(() => {
    const fetchFavouritesAndWeather = async () => {
      try {
        const favRes = await fetch(
          `https://wdatadetails.onrender.com/favCities`
        );
        if (!favRes.ok) {
          throw new Error("Failed to fetch favourite cities");
        }
        const favourites = await favRes.json();

        const validFavourites = favourites.filter(
          (cur) => cur.city && cur.city.trim() !== ""
        );

        const weatherPromises = validFavourites.map((cur) =>
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cur.city}&appid=${apiKey}&units=metric`
          ).then((res) => {
            if (!res.ok) {
              throw new Error(`Failed to fetch weather data for ${cur.city}`);
            }
            return res.json();
          })
        );

        const weatherResults = await Promise.all(weatherPromises);
        setWeatherData(
          weatherResults.map((city, index) => ({
            ...city,
            id: validFavourites[index].id,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);

        setWeatherData([]);
      }
    };

    fetchFavouritesAndWeather();
  }, []);

  if (weatherData.length === 0) {
    return <h3>Loading...</h3>;
  }

  return (
    <div>
      <button
        style={{ marginTop: "10", marginLeft: "20" }}
        onClick={() => navigate("/")}
      >
        Back
      </button>
      <h2 style={{ textAlign: "center" }}>Favourite cities</h2>
      <div className="favourite-cities">
        {weatherData.map((city) => (
          <div key={city.id} className="favourite-div">
            <h4 className="weathercity">{city.name}</h4>
            <h4>{city.main.temp}°C</h4>
            <button onClick={() => openModal(city.id)}>Update</button>
            <button onClick={() => deleteHandler(city.id)}>Delete</button>
          </div>
        ))}
      </div>

      {modalIsOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Enter new city name</h2>
              <button onClick={closeModal}>X</button>
            </div>
            <input
              className="modal-input"
              type="text"
              value={newCityName}
              onChange={handleInputChange}
              placeholder="City name"
            />
            <div className="modal-buttons">
              <button onClick={handleUpdate}>OK</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favourites;
