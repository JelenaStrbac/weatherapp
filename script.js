let weath = [];


function enterCity(e) {
    e.preventDefault();

    document.getElementById('loader').style.display = 'block'; 

    const loc = document.getElementById('iCity').value;
    console.log(loc);
    
    fetch(`http://api.weatherstack.com/current?access_key=3d067e465fea96840b85e108ffc5979d&query=${loc}`)
    .then((response) => {
        // if (response.status === 200) {
        //     return response;
        // } else {
        //     throw new Error('Response not valid');
        // }
        return response.json();
    })
    .then((weather) => {
        weath = weather;
        showWeather();
    })
    .catch(e => {
        console.log(e);
    });
    
}


function showWeather() {

    document.getElementById('loader').style.display = 'none';
    const showAll = document.getElementById('wrapper');
    showAll.style.display = 'flex';
    showAll.innerHTML = `<div>
                            <div>${weath.location.name}, ${weath.location.country}</div>
                            <div>${weath.current.temperature}°C</div>
                            <img src="${weath.current.weather_icons}">
                            <div>${weath.current.weather_descriptions}</div>
                        </div>
                        <div>
                            <div>Wind: ${weath.current.wind_speed} kmph</div>
                            <div>Precip: ${weath.current.precip} mm</div>
                            <div>Pressure: ${weath.current.pressure} mb</div>
                        </div>`   
}


document.getElementById('iForm').addEventListener('submit', enterCity);
