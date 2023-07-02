
// const searchPageUrl = document.location;
const eventSearchBtn = document.getElementById('event-search-btn');
// const artistSearchForm = document.querySelector('#search-artist-input');
// const locationEl = document.getElementById('location-input');
// const endDateEl = document.getElementById('end-date');
// const startDateEl = document.getElementById('start-date');
var artistSearchEl = document.getElementById('search-input').value;



function saveSearch(event) {
    var artistSearchEl = document.getElementById('search-input').value;
    sessionStorage.setItem('artistName',artistSearchEl);
    var artistNameValue = sessionStorage.getItem('artistName');
    console.log(artistNameValue);
    document.getElementById('userSearchInput').innerHTML = "Results for " + artistNameValue;
  };

eventSearchBtn.addEventListener('click',saveSearch);

