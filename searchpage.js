var artistSearch = '';
const lastApiKey = 'c023247640faedc6ce04a6fddaf22a29';
const lastApiSecret = '2ea11c4880a7e5b4ac0f5545e0a61f7a';
const lastMethod = 'artist.getInfo';
const lastParams = {};
var deezerOptions = {
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
function retrieveDeezerInfo(artistSearch) {
    var artistSearchUrl = 'https://deezerdevs-deezer.p.rapidapi.com/search?q=' + artistSearch;
  
    fetch(artistSearchUrl, deezerOptions)
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            console.log(result);
  
        var deezerArtistMatch = result.data.find(function(artist) {
            var decodedSearch = decodeURIComponent(artistSearch).toLowerCase();
            var decodedArtistName = decodeURIComponent(artist.artist.name).toLowerCase();
            return decodedSearch === decodedArtistName;
        });
  
        if (deezerArtistMatch) {
            console.log('It works!');
            console.log(deezerArtistMatch.artist.name);
            printDeezerInfo(deezerArtistMatch.artist);
            retrieveLastFmInfo(deezerArtistMatch.artist.name);
            saveArtistHistory(deezerArtistMatch);
        } else {
            console.log('No artist found');
            alert('Error: Artist not found');
        }
    })
    .catch(function(error) {
        console.log('Error:', error);
        alert('An error occurred while retrieving Deezer artist information');
    });
}

function retrieveLastFmInfo(name) {
    var lastUrl = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + name + '&api_key=' + lastApiKey + '&format=json';
    console.log(name);
    fetch(lastUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            console.log(result);

            if (result.artist) {
                console.log('Last FM artist found!');
                console.log(result.artist.name);
                printLastInfo(result.artist);
            } else {
                console.log('No Last FM artist info found');
                alert('Error: Last FM info not found');
            }
        })
        .catch(function(error) {
            console.log('last FM Error:', error);
            alert('An error occurred while retrieving Last.FM data');
        });
}

function printDeezerInfo(artist) {
    var artistName = artist.name;
    var artistId = artist.id;
    var artistPicture = artist.picture;
    var artistLink = artist.link;
    console.log(artistId, artistPicture, artistLink);
    
    var artistPlaylistUrl = 'https://widget.deezer.com/widget/dark/artist/' + artistId + '/top_tracks';
    document.getElementById('artist-playlist').src = artistPlaylistUrl;
  
    var artistHeaderCard = document.createElement('div');
    var artistHeaderName = document.createElement('h1');
    var artistHeaderPicture = document.createElement('img');
  
    artistHeaderCard.setAttribute('class', 'row h-50 py-5 pr-10');
    artistHeaderName.textContent = artistName;
    artistHeaderName.setAttribute('class', 'text-uppercase leader ml-5');
    artistHeaderPicture.setAttribute('class', 'header-picture');
    artistHeaderPicture.setAttribute('src', artistPicture);
  
    artistHeaderCard.appendChild(artistHeaderPicture);
    artistHeaderCard.appendChild(artistHeaderName);
  
    var artistHeaderEl = document.getElementById('artist-header');
    artistHeaderEl.innerHTML = '';
  
    artistHeaderEl.appendChild(artistHeaderCard);
}

function printLastInfo(artist) {
    var artistBioContent = artist.bio.summary.split('<a')[0];
    var artistBioLink = artist.bio.links.link.href;
    var artistBioPub = artist.bio.published;

    var artistBioCard = document.createElement('card');
    var artistBio = document.createElement('p');
    var artistBioPublished = document.createElement('cite')
    var artistBioUrl = document.createElement('a');

    artistBio.textContent = artistBioContent;
    artistBio.setAttribute('class', 'py-3')
    artistBioPublished.textContent = artistBioPub;
    artistBioPublished.setAttribute('class', 'place-right');
    artistBioUrl.setAttribute('href', artistBioLink);
    artistBioUrl.textContent = 'For full bio on ' + artist.name + ' on Last.FM, click here.';

    artistBioCard.appendChild(artistBio);
    artistBioCard.appendChild(artistBioPublished);
    artistBioCard.appendChild(artistBioUrl);

    var artistBioEl = document.getElementById('artist-bio');
    artistBioEl.innerHTML = '';
    artistBioEl.appendChild(artistBioCard);

    var artistSimilarArr = artist.similar.artist;
    console.log(artistSimilarArr);

    var similarArtistsEl = document.getElementById('similar-artists');
    similarArtistsEl.innerHTML = '';

    for (var i = 0; i < artistSimilarArr.length; i++) {
        var similarArtist = artistSimilarArr[i];
        var similarArtistTile = document.createElement('div');
        similarArtistTile.setAttribute('data-role', 'tile');
        similarArtistTile.setAttribute('data-effect', 'hover-slide-down');
        similarArtistTile.setAttribute('data-size', 'medium');
        similarArtistTile.setAttribute('class', 'artistTile cell-2 pr-2');
        similarArtistTile.setAttribute('id', 'artist-tile-' + i);

        var similarArtistImg = document.createElement('img');
        similarArtistImg.setAttribute('class', 'tileImg slide-front');
        similarArtistImg.setAttribute('src', similarArtist.image[1]['#text']);
        similarArtistImg.setAttribute('id', 'tile-img-' + i);

        var similarArtistName = document.createElement('h5');
        similarArtistName.setAttribute('class', 'artistName slide-back');
        similarArtistName.textContent = similarArtist.name;
        similarArtistName.setAttribute('id', 'artist-name-' + i);

        similarArtistTile.appendChild(similarArtistImg);
        similarArtistTile.appendChild(similarArtistName);
        similarArtistsEl.appendChild(similarArtistTile);
    }
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

function saveArtistHistory(deezerArtistMatch) {
    var artistSearches = JSON.parse(localStorage.getItem('artistSearches')) || [];
    artistSearches.push(deezerArtistMatch);
    localStorage.setItem('artistSearches', JSON.stringify(artistSearches));
    console.log(artistSearches);
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
  
      retrieveDeezerInfo(artistSearch);
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