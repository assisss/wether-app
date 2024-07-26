const userTab = document.querySelector("[ data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector(".data-searchForm");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

let oldTab = userTab;
// const API_KEY = "8ef402c65766eefe738fb945f588610c";
const API_KEY= "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromsessionStorage();


function switchTab(newTab) {
    if (newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            searchForm.classList.add("active");
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
        }
        else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromsessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    
    switchTab(userTab);
});


searchTab.addEventListener("click", () => {
    switchTab(searchTab)
});

function getfromsessionStorage() {
    const localcordinates = sessionStorage.getItem("user-cordinates");
    if (!localcordinates) {
        grantAccessContainer.classList.add("active");

    } else {
        const cordinates = JSON.parse(localcordinates);
        fetchUserWeatherInfo(cordinates);
    }
}


async function fetchUserWeatherInfo(cordinates) {
    const { lat, lon } = cordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    // api call 

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);



    } catch (err) {
        loadingScreen.classList.remove("active");

    }
}

function renderWeatherInfo(weatherInfo) {
     const cityName = document.querySelector(" [data-cityName]");
     const countryIcon = document.querySelector(" [data-countryIcon]");
     const desc = document.querySelector("[data-weatherDesc]");
     const weatherIcon = document.querySelector("[data-weathericon]");
     const temp = document.querySelector("[data-temp]");
     const windspeed = document.querySelector("[data-windspeed]");
     const humidity = document.querySelector(" [data-humidity]");
     const cloudiness = document.querySelector("[data-cloudness]");


     cityName.innerText= weatherInfo?.name;
     countryIcon.src= `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
     desc.innerText= weatherInfo?.weather?.[0]?.description;
     weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
 
     temp.innerText = `${weatherInfo?.main?.temp} °C `; 
     windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
 
     humidity.innerText = `${weatherInfo?.main?.humidity} %`;
     cloudiness.innerText = `${ weatherInfo?.clouds?.all} %`;
}
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);

    }
    else {
        // alert
        alert(" geolocation support not available");

    }
} 
  function  showposition(position){
      const userCordinates = {
        lat:position.coords.latitude,
        lon: position.coords.longitude,
      }

      sessionStorage.setItem("user-cordinates", JSON.stringify(userCordinates));
      fetchUserWeatherInfo(userCordinates);

  }

// const grantaccesbutton = document.querySelector("[data-grantaccess]");
// grantaccesbutton.addEventListener("click",getLocation);

const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector(".data-searchInput");

searchForm.addEventListener("submit", (e) => {

   e.preventDefault();

   let cityName = searchInput.value ;

   if(cityName === "") 
            return;
   else
       fetchSearchWeatherInfo(cityName);

})

async function fetchSearchWeatherInfo(city) { 
    loadingScreen.classList.add("active");
     userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");

try {

const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
);
const data = await response.json();

loadingScreen.classList.remove("active");
userInfoContainer.classList.add("active");
 renderWeatherInfo(data);

}

catch(err) {
    //hw
 }
}