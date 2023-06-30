const artistSearchUrl = 'https://deezerdevs-deezer.p.rapidapi.com/search?q=' + artistSearchEl;
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '1f74ad6fe1msh722b05fd40167f7p168350jsn83917ae41088',
		'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
	}
};
const searchPageUrl = document.location;
var eventSearchBtn = document.querySelector('#event-search-btn');
var artistSearchForm = document.querySelector('#search-artist-input');
var locationEl = document.getElementById('#location-input');
var endDateEl = document.getElementById('#end-date');
var startDateEl = document.getElementById('#start-date');
var artistSearchEl = document.getElementById('#search-artist-input');

// Function to retrieve artist information
function retrieveArtistInfo(artistSearchEl) {
    async function logData() {
        const response = await fetch(artistSearchUrl, options);
        // const result = await response.text();
        const result = await response.json();
        console.log(result);
    };
    // catch (error) {
    //     console.error(error);
    // }

    var artistName = data.list[0].artist.name;

    if (artistSearchEl !== artistName) {
        console.log('artist search error');
        alert('Error: Artist not found');
    } else {
      console.log('It works!')
    // getSimilarArtists(artistId);
    // renderArtistInfo(artistName, data.list[0]);
    // renderPlaylist(data.list);
    }
}







// Event handler for searchbar function
function handleEventSearch(event) {
    event.preventDefault();
  
    var eventSearch = {
      searchLocation: locationEl.value,
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
  
  //
  function handleArtistSearch(event) {
    event.preventDefault();
  
    var artistSearch = artistSearchEl.value;
    var artistSearches = JSON.parse(localStorage.getItem('artistSearches')) || [];
    artistSearches.push(artistSearch);
    localStorage.setItem('artistSearches', JSON.stringify(artistSearches));
    console.log(artistSearches);
    // retrieveArtistId(artistSearch);
    artistSearchEl.value = "";
  
    return false;
  }
  
//Event listener for search button
if (eventSearchBtn) {
  eventSearchBtn.addEventListener('click', handleEventSearch);
  console.log(eventSearchBtn);
}

if (artistSearchForm) {
  artistSearchForm.addEventListener('submit', handleArtistSearch);
  console.log(artistSearchForm);
}

function getParams() {
    console.log(document.location)
    if (searchPageUrl.includes('artist')) {
        var artistSearch = document.location.search.split('=');
        console.log(artistSearch);

        handleArtistSearchEvent(artistSearch);
    } else if (searchPageUrl.includes('searchlocation')) {
        var eventSearch = document.location.search.split('&');

        var searchLocation = eventSearch[0].split('=').pop();
        var startDate = eventSearch[1].split('=').pop();
        var endDate = eventSearch[2].split('=').pop();
        console.log(eventSearch);

        handleEventSearch(eventSearch);
    } else {
        return;
    }
    
}

getParams();