import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const App = () => {
  const [searchFilter, setSearchFilter] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    console.log("effect");
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div>
      find countries
      <input
        value={searchFilter}
        onChange={(e) => setSearchFilter(e.target.value)}
      />
      <ShowResults
        filteredCountries={filteredCountries}
        setSearchFilter={setSearchFilter}
      />
    </div>
  );
};
const ShowResults = ({ filteredCountries, setSearchFilter }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
    const fetchWeather = async () => {
      if (filteredCountries.length === 1 && filteredCountries[0].capital) {
        const capital = filteredCountries[0].capital[0];
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`;

        try {
          const response = await axios.get(apiUrl);
          setWeather(response.data);
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      }
    };

    fetchWeather();
  }, [filteredCountries]);

  if (filteredCountries.length === 1) {
    const country = filteredCountries[0];
    return (
      <div>
        <h2>{country.name.common}</h2>
        <div>capital {country.capital}</div>
        <div>area {country.area}</div>
        <h3>languages</h3>
        <ul>
          {Object.values(country.languages).map((language, index) => (
            <li key={index}>{language}</li>
          ))}
        </ul>
        <img src={country.flags.png} alt={country.name.common} width="200" />
        {weather && (
          <div>
            <h3>Weather in {country.capital}:</h3>
            <p>Temperature: {weather.main.temp}°C</p>
            <img
              src={`https://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
              alt="Weather Icon"
            />
            <p>wind: {weather.wind.speed}m/s</p>
          </div>
        )}
      </div>
    );
  }

  if (filteredCountries.length > 10)
    return <div>Too many matches,specify another filter</div>;

  return filteredCountries.map((country) => {
    return (
      <div key={country.name.common}>
        {country.name.common}
        <button onClick={() => setSearchFilter(country.name.common)}>
          Show
        </button>
      </div>
    );
  });
};

export default App;
