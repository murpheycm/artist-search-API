var artistSearch = '';
var options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '1f74ad6fe1msh722b05fd40167f7p168350jsn83917ae41088',
    'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
  }
};
var eventSearchBtn = document.querySelector('#event-search-btn');
var artistSearchForm = document.getElementById('artist-search-form');
var locationEl = document.getElementById('location-input');
var endDateEl = document.getElementById('end-date');
var startDateEl = document.getElementById('start-date');
var artistSearchEl = document.getElementById('search-artist-input');

// Function to retrieve artist information
function retrieveArtistInfo(artistSearch) {
    var artistSearchUrl = 'https://deezerdevs-deezer.p.rapidapi.com/search?q=' + artistSearch;
  
    fetch(artistSearchUrl, options)
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            console.log(result);
    
            if (result.data.length > 0) {
                var artistName = result.data[0].artist.name;
                var decodedSearch = decodeURIComponent(artistSearch).toLowerCase();
                var decodedArtistName = decodeURIComponent(artistName).toLowerCase();
        
                if (decodedSearch !== decodedArtistName) {
                    console.log('artist search error');
                    console.log(decodedSearch, decodedArtistName);
                    alert('Error: Artist not found');
                } else {
                    console.log('It works!');
                    console.log(decodedSearch, decodedArtistName);
                    var artistId = result.data[0].artist.id;
                    var artistPicture = result.data[0].artist.picture;
                    var artistLink = result.data[0].artist.link;
                    console.log(artistId, artistPicture, artistLink);
                    printArtistInfo(artistId, artistPicture, artistLink);
                }
            } else {
            console.log('No artist found');
            alert('Error: Artist not found');
            }
    })
      .catch(function(error) {
        console.log('Error:', error);
        alert('An error occurred while retrieving artist information');
      });
}

function printArtistInfo(artistId, artistPicture, artistLink) {
    var artistPlaylistUrl = 'https://widget.deezer.com/widget/dark/artist/' + artistId + '/top_tracks';
    document.getElementById('artist-playlist').src = artistPlaylistUrl;
}

function handleEventSearch(event) {
  event.preventDefault();

  var searchLocation = locationEl.value;
  var startDate = startDateEl.value;
  var endDate = endDateEl.value;

  if (!searchLocation || !startDate || !endDate) {
    console.error('You need a search input value!');
    alert('Please enter a Location, Start Date, and End Date!');
    return;
  }

  var queryString = './searchpage.html?searchlocation=' + searchLocation + '&startdate=' + startDate + '&enddate=' + endDate;
  location.assign(queryString);
  locationEl.value = '';
  startDateEl.value = '';
  endDateEl.value = '';
}

function handleArtistSearch(event) {
    event.preventDefault();
  
    var artistSearch = artistSearchEl.value;
  
    if (!artistSearch) {
      console.error('You need a search input value!');
      alert('Please Enter an Artist');
      return;
    }
  
    var queryString = './searchpage.html?artist=' + artistSearch;
  
    localStorage.setItem('artistSearch', artistSearch);
    location.assign(queryString);
  
    artistSearchEl.value = '';
  }

function saveEventHistory(searchLocation, startDate, endDate) {
  var eventSearches = JSON.parse(localStorage.getItem('eventSearches')) || [];
  var eventSearch = {
    searchLocation: searchLocation,
    startDate: startDate,
    endDate: endDate
  };
  eventSearches.push(eventSearch);
  localStorage.setItem('eventSearches', JSON.stringify(eventSearches));
  console.log(eventSearches);
}

function saveArtistHistory(artistSearch) {
  var artistSearches = JSON.parse(localStorage.getItem('artistSearches')) || [];
  artistSearches.push(artistSearch);
  localStorage.setItem('artistSearches', JSON.stringify(artistSearches));
  console.log(artistSearches);
  retrieveArtistInfo(artistSearch);
}



  
//Event listener for search button
if (eventSearchBtn){
    eventSearchBtn.addEventListener('click', handleEventSearch);
    console.log(eventSearchBtn);
  }
  
  if (artistSearchForm) {
    artistSearchForm.addEventListener('submit', handleArtistSearch);
  }

function getParams() {
    console.log(document.location);
    if (document.location.search.includes('artist')) {
      var artistSearch = document.location.search.split('=').pop();
      console.log(artistSearch);
  
      retrieveArtistInfo(artistSearch);
      saveArtistHistory(artistSearch);
    } else if (document.location.search.includes('searchlocation')) {
      var eventSearchArr = document.location.search.split('&');
  
      var searchLocation = eventSearchArr[0].split('=').pop();
      var startDate = eventSearchArr[1].split('=').pop();
      var endDate = eventSearchArr[2].split('=').pop();
      console.log(eventSearchArr);
  
      saveEventHistory(searchLocation, startDate, endDate);
    } else {
      return;
    }
  }


getParams();