var eventSearchBtn = document.querySelector('#event-search-btn');
var artistSearchForm = document.querySelector('#artist-search form');
var locationEl = document.getElementById('location-input');
var endDateEl = document.getElementById('end-date');
var startDateEl = document.getElementById('start-date');
var artistSearchEl = document.getElementById('search-artist-input');

function handleEventSearch(event) {
    event.preventDefault();
  
    
      var searchLocation = locationEl.value;
      var startDate = startDateEl.value;
      var endDate = endDateEl.value;
  
    
        if (!location || !startDate || !endDate) {
          console.error('You need a search input value!');
          alert('Please enter a Location, Start Date, and End Date!')
          return;
        }
      
        var queryString = './searchpage.html?searchlocation=' + searchLocation + '&startdate=' + startDate + '&enddate=' + endDate;
      
      location.assign(queryString);
      locationEl.value = "";
      startDateEl.value = "";
      endDateEl.value = "";
  }

  
  function handleArtistSearch(event) {
    event.preventDefault();
  
    var artistSearch = artistSearchEl.value;

    if (!artistSearch) {
      console.error('You need a search input value!');
      alert('Please Enter an Artist')
      return;
    }
  
    var queryString = './searchpage.html?artist=' + artistSearch;
  
    location.assign(queryString);
  
    artistSearchEl.value = "";
  }
  

if (eventSearchBtn) {
  eventSearchBtn.addEventListener('click', handleEventSearch);
  console.log(eventSearchBtn);
}

if (artistSearchForm) {
  artistSearchForm.addEventListener('submit', handleArtistSearch);
  console.log(artistSearchForm);
}
