let weather = [];

let state = {
    lastUpdate: 0,
    intervalID: 0
};

// LOADER functions
function renderLoader() {
    const loader = document.getElementById('loader');
    loader.style.display = 'block';
};

function clearLoader() {
    const loader = document.getElementById('loader');
    loader.style.display = 'none';
};

// render weather icons
function renderWeatherIcons() {
    let src;
    const descr = weather.current.weather_descriptions[0];
    const isDay = weather.current.is_day;

    switch (descr) {
        case 'Sunny':
        case 'Clear':
            isDay === 'no' ? src = 'moon.svg' : src = 'sun.svg';
            break;
        case 'Overcast':
            isDay === 'no' ? src = 'moon.svg' : src = 'cloud.svg';
            break;
        case 'Partly cloudy':
            isDay === 'no' ? src = 'moon.svg' : src = 'cloudy.svg';
            break;
        case 'Rain':
        case 'Light Rain':
            src = 'rain.svg';
            break;
        case 'Storm':
            src = 'storn.svg';
            break;
        case 'Snow':
        case 'Heavy snow':
            src = 'snowing.svg';
            break;
        default:
            src = '';
    }
    return src;
}


// dynamic background
function dynamicBckg() {
    let bckg;
    const descr = weather.current.weather_descriptions[0];
    const isDay = weather.current.is_day;

    switch (descr) {
        case 'Sunny':
        case 'Clear':
            isDay === 'no' ? bckg = 'night-clear.jpg' : bckg = 'sunny.jpg';
            break;
        case 'Overcast':
            isDay === 'no' ? bckg = 'night-cloud.jpg' : bckg = 'overcast.jpg';
            break;
        case 'Partly cloudy':
            isDay === 'no' ? bckg = 'night-cloud.jpg' : bckg = 'partlycloudy.jpg';
            break;
        case 'Rain':
        case 'Light Rain':
            isDay === 'no' ? bckg = 'night-rain.jpg' : bckg = 'rain.jpg';
            break;
        case 'Storm':
            isDay === 'no' ? bckg = 'night-storm.jpg' : bckg = 'storm.jpg';
            break;
        case 'Snow':
        case 'Heavy snow':
            bckg = 'snow.jpg';
            break;
        default:
            bckg = '';
    }

    document.body.style.backgroundImage = `url('background/${bckg}')`;
    document.body.style.backgroundSize = 'cover';
};


// current date
function currentDate() {
    return new Date().toLocaleDateString();
};

// rendering elements
function renderElements() {
    const showAll = document.getElementById('wrapper');
    showAll.style.display = 'flex';
    showAll.innerHTML = `        
            <div class="main">
                <div class="city">${weather.location.name}, ${weather.location.country}</div>
                <div class="date">${currentDate()}</div>
                <div class="degree">${weather.current.temperature}°</div>
                <img id="weather-icon" src="icons/${renderWeatherIcons()}">
                <div class="description">${weather.current.weather_descriptions}</div>
            </div>
            <div>
                <div class="wpp">
                    <div class="wpp-small">
                        <div class="info-item">
                            <span class="info-m"><i class="fas fa-wind"></i>${weather.current.wind_speed} kmph</span>
                            <span class="info-text"></i>Wind</span>
                        </div>

                        <div class="info-item">
                            <span class="info-m"><i class="fas fa-tint"></i>${weather.current.precip} mm</span>
                            <span class="info-text">Precipitation</span>
                        </div>
                    </div>

                    <div class="wpp-small">
                        <div class="info-item">
                            <span class="info-m"><i class="far fa-clock"></i>${weather.current.pressure} mb</span>
                            <span class="info-text">Pressure</span>
                        </div>

                        <div class="info-item">
                            <span class="info-m"><i class="fas fa-water"></i>${weather.current.humidity} %</span>
                            <span class="info-text">Humidity</span>
                        </div>
                    </div>
                </div>

                <div class="feels-like">
                    <div class="feels-like-small">
                        <span class="info-m"><i class="fas fa-temperature-low"></i>${weather.current.feelslike}°</span>
                        <span class="info-text"></i>Feels like</span>
                    </div>
                    <div><img class="refresh-btn" src="icons/refresh.svg" alt="refresh"> Updated <strong id="min"></strong> min ago
                    </div>
                </div>
            </div>
                    `
};


// clear elements
function clearElements() {
    const showAll = document.getElementById('wrapper');
    showAll.innerHTML = '';
};

//display weather on UI
function showWeather() {

    // remove loader
    clearLoader();
    
    // display dynamic background
    dynamicBckg();

    // update state 
    state.lastUpdate = Date.now();
    
    // render elements
    renderElements();

    // time
    state.intervalID = setInterval(updateTime, 1000);
       
};



// CURRENT IP LOCATION function
function loadCurrentLoc() {
    // show loader
    renderLoader();
    clearElements();
    clearTime();

    // fetching data - current IP address
    fetch(`http://api.weatherstack.com/current?access_key=3d067e465fea96840b85e108ffc5979d&query=fetch:ip`)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        weather = data;
        showWeather();
        console.log(weather);
        
    })
    .catch(e => {
        console.log(e);
    });
};


// SEARCHING LOCATION function
function enterCity() {

    // show loader
    renderLoader();
    clearElements();
    clearTime();

    // get location from input field
    const loc = document.getElementById('iCity').value;

    // fetching data - searching location
    fetch(`http://api.weatherstack.com/current?access_key=3d067e465fea96840b85e108ffc5979d&query=${loc}`)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        weather = data;
        showWeather();
    })
    .catch(e => {
        console.log(e);
    }); 
};


// event listeners
window.addEventListener('load', loadCurrentLoc);
document.getElementById('fSearch').addEventListener('submit', e => {
    e.preventDefault();
    enterCity();
});
document.getElementById('wrapper').addEventListener('click', e => {
    const btn = e.target.matches('.refresh-btn, .refresh-btn *'); 
    const loc = document.getElementById('iCity').value;

    if (btn && !loc) {
        loadCurrentLoc();
    } else if (btn && loc) {
        enterCity();
    }
});


// UPDATE TIME function
function updateTime() {
    let now = Date.now();
    let diff;
    const minutesAgo = document.getElementById('min');
    
    diff = Math.floor((now - state.lastUpdate) / (1000 * 60));
        minutesAgo.textContent = diff;
    
};



function clearTime(){
    clearInterval(state.intervalID);
    state.intervalID = 0;
};





