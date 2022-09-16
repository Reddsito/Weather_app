const wrapper = document.querySelector('.wrapper'),
inputBox = document.querySelector('.wrapper__input-box'),
infoTxt = document.querySelector('.wrapper__info-txt'),
inputField = document.querySelector('input'),
button = document.querySelector('button'),
key = "d3c87d4845bebd73385f44a4ef3258b9",
back = document.querySelector('.wrapper__icon'),
wIcon = document.querySelector('.weather__icon')

inputField.addEventListener('keyup', e => {
    if(e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
})

button.addEventListener('click', () => {
    //Comprobar si el navegador cuenta con esta api
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSucess, onError);
    }
})

back.addEventListener('click', () => {
    wrapper.classList.remove('--active')
    inputField.value = ""
})

function onError(error) {
    infoTxt.innerText = `${error.message}`
    infoTxt.classList.add('--error')
}

function onSucess(position) {
    const {latitude, longitude} = position.coords;
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${key}`
    infoTxt.classList.remove('--error')
    fetchData(api)
}

function requestApi(city) {
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`;
    fetchData(api)
}

function fetchData(api) {
    infoTxt.innerText = "Getting weather details..."
    infoTxt.classList.add('--pending')
    fetch(api).then(response => response.json()).then(json => weatherDetails(json))
}

function weatherDetails(info) {
   if(info.cod == '404') {
        infoTxt.innerText = "is not a valid city name.."
        infoTxt.classList.remove('--pending')
        infoTxt.classList.add('--error')
   } else {
    const city = info.name
    const country = info.sys.country
    const {description, id} = info.weather[0]
    const {feels_like, humidity, temp} = info.main

    if(id == 800) {
        wIcon.src = 'icons/clear.svg'
    } else if (id >= 200 && id <= 232) {
        wIcon.src = 'icons/strom.svg'
    }else if (id >= 600 && id <= 2622) {
        wIcon.src = 'icons/snow.svg'
    }else if (id >= 701 && id <= 781) {
        wIcon.src = 'icons/haze.svg'
    }else if (id >= 801 && id <= 804) {
        wIcon.src = 'icons/cloud.svg'
    }else if( (id >= 300 && id <= 321) || (id >= 500 && id <= 531)  )   {
        wIcon.src = 'icons/rain.svg'
    }


    wrapper.querySelector(".weather__numb").innerText = Math.floor(temp)
    wrapper.querySelector(".weather__location").innerText =`${country}, ${city}`
    wrapper.querySelector(".humidity .weather__numb").innerText = humidity
    wrapper.querySelector(".weather__column .weather__numb").innerText = Math.floor(feels_like)
    wrapper.querySelector('.weather__txt').innerText = description
        infoTxt.classList.remove('--pending', '--error')
        wrapper.classList.add('--active')
   }
}