let weather = [];

let state = {
  lastUpdate: 0,
  intervalID: 0,
};

// LOADER functions
function renderLoader() {
  const loader = document.getElementById("loader");
  loader.style.display = "block";
}

function clearLoader() {
  const loader = document.getElementById("loader");
  loader.style.display = "none";
}

// render weather icons
function renderWeatherIcons() {
  let src;
  const descr = weather.weather[0].icon;

  switch (descr) {
    case "01d":
      src = "sun.svg";
      break;
    case "01n":
    case "02n":
      src = "moon.svg";
      break;
    case "03d":
    case "03n":
      src = "cloudy.svg";
      break;
    case "04d":
    case "04n":
      src = "cloud.svg";
      break;
    case "09d":
    case "09n":
    case "10d":
    case "10n":
      src = "rain.svg";
      break;
    case "11d":
    case "11n":
      src = "storn.svg";
      break;
    case "13d":
    case "13n":
      src = "snowing.svg";
      break;
    case "50d":
    case "50n":
      src = "mist.svg";
      break;
    default:
      src = "sun.svg";
  }
  return src;
}

// current date
function currentDate() {
  return new Date().toLocaleDateString();
}

// rendering elements
function renderElements() {
  const showAll = document.getElementById("wrapper");
  showAll.style.display = "flex";
  showAll.innerHTML = `        
            <div class="main">
                <div class="city">${weather.name}, ${weather.sys.country}</div>
                <div class="date">${currentDate()}</div>
                <div class="degree">${Math.round(weather.main.temp)}°C</div>
                <img id="weather-icon" src="icons/${renderWeatherIcons()}">
                <div class="description">${weather.weather[0].main}</div>
            </div>
            <div>
                <div class="wpp">
                    <div class="wpp-small">
                        <div class="info-item">
                            <span class="info-m"><i class="fas fa-wind"></i>${
                              weather.wind.speed
                            } m/s</span>
                            <span class="info-text"></i>Wind</span>
                        </div>

                        <div class="info-item">
                            <span class="info-m"><i class="fas fa-${
                              weather.rain ? "tint" : "cloud"
                            }"></i>
                            ${
                              weather?.rain?.["1h"] ||
                              weather?.rain?.["3h"] ||
                              weather.clouds.all
                            }
                            ${" "}
                            ${weather.rain ? "mm" : "%"}</span>
                            <span class="info-text">${
                              weather.rain ? "Precipitation" : "Cloudiness"
                            }</span>
                        </div>
                    </div>

                    <div class="wpp-small">
                        <div class="info-item">
                            <span class="info-m"><i class="far fa-clock"></i>${
                              weather.main.pressure
                            } mb</span>
                            <span class="info-text">Pressure</span>
                        </div>

                        <div class="info-item">
                            <span class="info-m"><i class="fas fa-water"></i>${
                              weather.main.humidity
                            } %</span>
                            <span class="info-text">Humidity</span>
                        </div>
                    </div>
                </div>

                <div class="feels-like">
                    <div class="feels-like-small">
                        <span class="info-m"><i class="fas fa-temperature-low"></i>${Math.round(
                          weather.main.feels_like
                        )}°C</span>
                        <span class="info-text"></i>Feels like</span>
                    </div>
                    <div><img class="refresh-btn" src="icons/refresh.svg" alt="refresh"> Updated <strong id="min"></strong> min ago
                    </div>
                </div>
            </div>
                    `;
}

// clear elements
function clearElements() {
  const showAll = document.getElementById("wrapper");
  showAll.innerHTML = "";
}

//display weather on UI
function showWeather() {
  // remove loader
  clearLoader();

  // update state
  state.lastUpdate = Date.now();

  // render elements
  renderElements();

  // time
  state.intervalID = setInterval(updateTime, 1000);
}

function showLoaderAndCleanElements() {
  renderLoader();
  clearElements();
  clearTime();
}

function fetchWeatherData(url) {
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      weather = data;
      console.log(weather);
      showWeather();
    })
    .catch((e) => {
      console.log(e);
    });
}

// CURRENT IP LOCATION function
function loadCurrentLoc() {
  // show loader
  showLoaderAndCleanElements();

  function getPosition() {
    return new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );
  }
  getPosition()
    .then((position) => position.coords)
    .then((coords) => {
      // fetching data - current location
      fetchWeatherData(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=30c174ec2ba71f992035ddbd346caad7`
      );
    })
    .catch((err) => {
      // if user denies geolocation data show weather for London
      fetchWeatherData(
        `https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=30c174ec2ba71f992035ddbd346caad7`
      );
      console.error(err.message);
    });
}

// SEARCHING LOCATION function
function enterCity() {
  // show loader
  showLoaderAndCleanElements();

  // get location from input field
  const loc = document.getElementById("iCity").value.toLowerCase();

  // fetching data - searching location
  fetchWeatherData(
    `https://api.openweathermap.org/data/2.5/weather?q=${loc}&units=metric&appid=30c174ec2ba71f992035ddbd346caad7`
  );
}

// event listeners
window.addEventListener("load", loadCurrentLoc);
document.getElementById("fSearch").addEventListener("submit", (e) => {
  e.preventDefault();
  enterCity();
});
document.getElementById("wrapper").addEventListener("click", (e) => {
  const btn = e.target.matches(".refresh-btn, .refresh-btn *");
  const loc = document.getElementById("iCity").value;

  if (btn && !loc) {
    loadCurrentLoc();
  } else if (btn && loc) {
    enterCity();
  }
});

// UPDATE TIME functions
function updateTime() {
  let now = Date.now();
  let diff;
  const minutesAgo = document.getElementById("min");

  diff = Math.floor((now - state.lastUpdate) / (1000 * 60));
  minutesAgo.textContent = diff;
}

function clearTime() {
  clearInterval(state.intervalID);
  state.intervalID = 0;
}
