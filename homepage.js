var eventSearchBtn = document.querySelector('#event-search-btn');
var artistSearchForm = document.querySelector('#artist-search form');
var locationEl = document.getElementById('location-input');
var endDateEl = document.getElementById('end-date');
var startDateEl = document.getElementById('start-date');
var artistSearchEl = document.getElementById('search-artist-input');

function handleEventSearch(event) {
    event.preventDefault();
  
    var eventSearch = {
      location: locationEl.value,
      startDate: startDateEl.value,
      endDate: endDateEl.value
    };
  
    var eventSearches = JSON.parse(localStorage.getItem('eventSearches')) || [];
    eventSearches.push(eventSearch);
    localStorage.setItem('eventSearches', JSON.stringify(eventSearches));
    console.log(eventSearches);
  
    locationEl.value = "";
    startDateEl.value = "";
    endDateEl.value = "";
  
    return false;
  }
  
  function handleArtistSearch(event) {
    event.preventDefault();
  
    var artistSearch = artistSearchEl.value;
    var artistSearches = JSON.parse(localStorage.getItem('artistSearches')) || [];
    artistSearches.push(artistSearch);
    localStorage.setItem('artistSearches', JSON.stringify(artistSearches));
    console.log(artistSearches);
  
    artistSearchEl.value = "";
  
    return false;
  }
  

if (eventSearchBtn) {
  eventSearchBtn.addEventListener('click', handleEventSearch);
  console.log(eventSearchBtn);
}

if (artistSearchForm) {
  artistSearchForm.addEventListener('submit', handleArtistSearch);
  console.log(artistSearchForm);
}