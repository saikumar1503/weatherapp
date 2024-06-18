import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Search = ({ query, setQuery, curr, setCurr }) => {
  const [id, setId] = useState(uuidv4());

  const navigate = useNavigate();

  const clickHandler = () => {
    fetch("https://wdatadetails.onrender.com/favCities")
      .then((response) => response.json())
      .then((data) => {
        const cityExists = data.some(
          (favCity) => favCity.city.toLowerCase() === query.toLowerCase()
        );

        if (cityExists) {
          toast.warn("City is already in the favourites list.");
        } else {
          const newFavourite = {
            id: uuidv4(),
            city: query,
          };

          fetch("https://wdatadetails.onrender.com/favCities", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newFavourite),
          })
            .then((response) => {
              if (!response.ok) {
                return response.text().then((text) => {
                  throw new Error(
                    `Network response was not ok: ${response.statusText}. Response: ${text}`
                  );
                });
              }
              return response.json();
            })
            .then((data) => {
              toast.success("City successfully added to favourites.");
              setId(uuidv4());
            })
            .catch((error) => {
              console.error("Error:", error);
              toast.error(
                "An error occurred while adding the city to favourites."
              );
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching favourite cities:", error);
        toast.error("An error occurred while fetching favourite cities.");
      });
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className="main">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Enter city"
        className="searchInput"
      />

      <img
        onClick={() => setCurr(!curr)}
        className="navigate-img"
        src="data:image/png;base64,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"
      />

      <button className="addToFavouritesBtn" onClick={clickHandler}>
        Add to favourites
      </button>
      <button onClick={() => navigate("/favorities")}>Favourites</button>
      <ToastContainer />
    </div>
  );
};

export default Search;
