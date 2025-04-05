import { useRef, useState } from "react";

function App() {
  const [weatherData, setWeatherData] = useState({});
  const [cityNames, setCityNames] = useState([]);
  let Loading = false;
  const cityRef = useState();

  // private api key
  const API_Key = "3e17506640f02a9938a0ec7cfa0bfa6a";

  async function getCoordinates(cityName, cityNumber) {
    try {
      let response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${cityNumber}&appid=${API_Key}`
      );
      response = await response.json();
      return response;
    } catch (err) {
      return err;
    }
  }

  async function getCityNames(cityName) {
    try {
      if (!cityName) {
        setCityNames([]);
      }
      const response = await getCoordinates(cityName, 5);
      setCityNames([...response]);
    } catch (err) {
      return err;
    }
  }

  async function getWeatherDataByName() {
    try {
      const coordinates = await getCoordinates(cityRef.current.value, 1);
      getWeatherData({ lat: coordinates[0].lat, lon: coordinates[0].lon });
    } catch (err) {
      return err;
    }
  }

  const getWeatherData = async ({ lat, lon }) => {
    Loading = true;
    setCityNames([]);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_Key}`
    );
    const weatherData = await response.json();
    setWeatherData(weatherData);
    console.log(weatherData);
    Loading = false;
  };
  return (
    <>
      <div className="container">
        <div className="card">
          <div className="search">
            <input
              placeholder="Enter City Name.."
              type="text"
              ref={cityRef}
              onChange={(e) => getCityNames(e.target.value)}
            />
            <div className="list-items">
              {cityNames.map((city, index) => {
                return (
                  <div
                    key={index}
                    onClick={() =>
                      getWeatherData({ lat: city.lat, lon: city.lon })
                    }
                  >
                    {city.name},{city.state},{city.country}
                  </div>
                );
              })}
            </div>
            <button onClick={getWeatherDataByName}>Get Weather</button>
          </div>
          <span className={"hr-line " + Loading ? "visible" : ""}></span>
          <div className="body">
            <div>
              <h3>Temperature</h3>
              <p>Min Temp : {weatherData.main?.temp_min}</p>
              <p>Temp : {weatherData.main?.temp}</p>
              <p>Max Temp :{weatherData.main?.temp_max}</p>
              <p>Pressure : {weatherData.main?.pressure}</p>
              <p>Humidity : {weatherData.main?.humidity}</p>
            </div>
            <div>
              <h3>{weatherData?.name}</h3>
              <p>{weatherData.sys?.country}</p>
              {/* <p>{weatherData.weather["0"].main}</p>
              <p>{weatherData.weather["0"].description}</p> */}
              <p>{weatherData.weather?.icon}</p>
              <h3>Sunrise / Sunset</h3>
              <p>
                {weatherData.sys?.sunrise} / {weatherData.sys?.sunset}
              </p>
            </div>
            <div>
              <h3>Wind Speed</h3>
              <p>{weatherData.wind?.speed}</p>
              <br />
              <h3>Visibility</h3>
              <p>{weatherData?.visibility}</p>
              <h3>Feels Like</h3>
              <p>{weatherData.main?.feels_like}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
