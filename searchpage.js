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
var artistTileEl = document.querySelector('.artist-tile')

// Function to retrieve artist information
function retrieveDeezerInfo(artistSearch) {
    var deezerSearchUrl = 'https://deezerdevs-deezer.p.rapidapi.com/search?q=' + artistSearch;
  
    fetch(deezerSearchUrl, deezerOptions)
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
            console.log('Deezer Artist Match: ', deezerArtistMatch.artist.name);
            var deezerArtistName = deezerArtistMatch.artist.name
            printDeezerInfo(deezerArtistMatch.artist);
            retrieveLastFmInfo(deezerArtistName);
            saveArtistHistory(deezerArtistName);
            getTourDates(deezerArtistName);
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
    var artistBioPublished = document.createElement('cite');
    var artistBioUrl = document.createElement('a');

    artistBio.textContent = artistBioContent;
    artistBio.setAttribute('class', 'py-3');
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
        var similarArtist = artistSimilarArr[i].name;
        console.log('Similar Artist: ', similarArtist);
        var similarArtistTile = document.createElement('div');

        var similarArtistImg = document.createElement('img');
        similarArtistImg.setAttribute('class', 'tileImg slide-front');

        // Call the getSimilarArtistImg function
        getSimilarArtistImg(similarArtist, similarArtistImg);

        function getSimilarArtistImg(similarArtist, similarArtistImg) {
            var deezerSearchUrl = 'https://deezerdevs-deezer.p.rapidapi.com/search?q=' + encodeURIComponent(similarArtist);

            fetch(deezerSearchUrl, deezerOptions)
                .then(function(response) {
                    if (!response.ok) {
                        throw new Error('Failed to fetch Similar Artist img Search');
                    }
                    return response.json();
                })
                .then(function(result) {
                    if (result.data && result.data.length > 0) {
                        console.log(similarArtist, result);
                        // var deezerSimilarArtistMatch = result.data.find(function(similarArtist) {
                        //     var decodedSearch = decodeURIComponent(similarArtist).toLowerCase();
                        //     var decodedArtistName = decodeURIComponent(data[0].artist.name).toLowerCase();
                        var deezerSimilarArtistMatch = result.data.find(function(artist) {
                            var decodedSearch = decodeURIComponent(similarArtist).toLowerCase();
                            var decodedArtistName = decodeURIComponent(artist.artist.name).toLowerCase();
                            return decodedSearch === decodedArtistName;
                        });

                        if (deezerSimilarArtistMatch) {
                            console.log('It works!');
                            console.log(deezerSimilarArtistMatch.artist.name);
                            var similarArtistImgSrc = deezerSimilarArtistMatch.artist.picture_medium;
                            similarArtistImg.setAttribute('src', similarArtistImgSrc);
                            similarArtistImg.setAttribute('id', deezerSimilarArtistMatch.artist.name);
                        } else {
                            console.log(similarArtist, 'No artist found');
                        }
                    } else {
                        console.log('No similar artist data found');
                    }
                })
                .catch(function(error) {
                    console.log('similar artist error', error);
                });
        }

        similarArtistTile.setAttribute('data-role', 'tile');
        similarArtistTile.setAttribute('data-effect', 'hover-zoom-right');
        similarArtistTile.setAttribute('data-size', 'medium');
        similarArtistTile.setAttribute('class', 'artist-tile cell-2 pr-2 border-black flex-justify-center flex-align-center');
        similarArtistTile.setAttribute('id', 'artist-tile-' + i);

        var similarArtistName = document.createElement('h5');
        similarArtistName.setAttribute('class', 'artistName slide-back text-center p-4');
        similarArtistName.textContent = similarArtist;
        similarArtistName.setAttribute('id', 'artist-name-' + i);

        similarArtistTile.appendChild(similarArtistImg);
        similarArtistTile.appendChild(similarArtistName);
        similarArtistsEl.appendChild(similarArtistTile);

        // Call the getSimilarArtistImg function
        getSimilarArtistImg(similarArtist, similarArtistImg);
    }
}

function getTourDates(deezerArtistName) {
    var ticketmasterApiUrl = 'https://app.ticketmaster.com/discovery/v2/events?apikey=tNLADXtluSf6FmnNfmVlChS3d2UQXC6G&keyword=' + deezerArtistName + '&locale=*';
    fetch(ticketmasterApiUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            console.log('ticketmaster', result);

            if (result._embedded && result._embedded.events && result._embedded.events.length > 0) {
                console.log('Ticketmaster Response: ', result);
                var tourDates = result._embedded.events;
                console.log(tourDates);
                printTourDates(tourDates);
            } else {
                console.log('No tour dates found');
                alert('Error: Tour dates not found');
                var tourDatesEl = document.getElementById('tour-dates');
                var noTourDates = document.createElement('p');
                noTourDates.textContent = 'No Tour Dates at this time.';
                tourDatesEl.appendChild(noTourDates);
            }
        })
        .catch(function(error) {
            console.log('Error:', error);
            alert('An error occurred while retrieving artist tour date information');
        });
}

function printTourDates(tourDates) {
    var tourDatesEl = document.getElementById('tour-dates');
    tourDatesEl.innerHTML = '';

    for (var i = 0; i < tourDates.length; i++) {
        console.log(tourDates[i]);
        var tourDateName = tourDates[i].name;
        var tourDate = tourDates[i].dates.start.dateTime;
        var tourDateLocation = {
            tourDateVenue: tourDates[i]._embedded.venues[0].name,
            tourDateCity: tourDates[i]._embedded.venues[0].city.name,
            tourDateCountry: tourDates[i]._embedded.venues[0].country.name
        };
        var tourDateAttrArray = tourDates[i]._embedded.attractions;
        var tourDateTicketUrl = tourDates[i].url;
        console.log(tourDateName, tourDate, tourDateLocation, tourDateAttrArray, tourDateTicketUrl);

        var tourDateEl = document.createElement('li');
        var tourDateNameEl = document.createElement('p');
        var tourDateLocEl = document.createElement('p');
        var tourDateTimeEl = document.createElement('p');
        var tourDateAttrEl = document.createElement('p');
        var tourDateTicketBtn = document.createElement('button');

        tourDateNameEl.textContent = 'Name: ' + tourDateName;
        tourDateLocEl.textContent = 'Location: ' + tourDateLocation.tourDateVenue + ', ' + tourDateLocation.tourDateCity + ', ' + tourDateLocation.tourDateCountry;
        tourDateTimeEl.textContent = 'Date & Time: ' + tourDate;
        tourDateAttrEl.textContent = 'Attractions: ';
        for (var j = 0; j < tourDateAttrArray.length; j++) {
            tourDateAttrEl.textContent += tourDateAttrArray[j].name + ', ';
        }
        tourDateAttrEl.textContent = tourDateAttrEl.textContent.slice(0, -2);
        tourDateTicketBtn.textContent = 'Get Tickets';
        tourDateTicketBtn.setAttribute('href', tourDateTicketUrl);
        tourDateAttrEl.setAttribute('class', 'second-label');

        tourDateEl.appendChild(tourDateNameEl);
        tourDateEl.appendChild(tourDateLocEl);
        tourDateEl.appendChild(tourDateTimeEl);
        tourDateEl.appendChild(tourDateAttrEl);
        tourDateEl.appendChild(tourDateTicketBtn);

        tourDatesEl.appendChild(tourDateEl);
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
    console.log(artistSearchForm);
}

// if (artistSearchEl) {
//     this.addEventListener('click', handleArtistSearch(artistSearch));
//     artistSearch = this.id;
// }

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