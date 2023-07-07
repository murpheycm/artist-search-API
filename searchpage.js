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
var similarArtistTiles = document.querySelectorAll('.artist-tile')
var artistHistoryEl = document.getElementById('artist-history');
var overlayImg = document.querySelector('.img-overlay');

// Function to retrieve artist information
function retrieveDeezerInfo(artistSearch) {
    var deezerSearchUrl = 'https://deezerdevs-deezer.p.rapidapi.com/search?q=artist:"' + artistSearch + '"';
  
    fetch(deezerSearchUrl, deezerOptions)
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            console.log(result);
  
        var deezerArtistMatch = result.data.find(function(artist) {
            var decodedSearch = decodeURIComponent(artistSearch).toLowerCase();
            var decodedArtistName = decodeURIComponent(artist.artist.name).toLowerCase();
            return decodedSearch.includes(decodedArtistName);
        });
  
        if (deezerArtistMatch) {
            console.log('It works!');
            console.log('Deezer Artist Match: ', deezerArtistMatch.artist.name);
            var deezerArtistName = deezerArtistMatch.artist.name
            printDeezerInfo(deezerArtistMatch.artist);
            retrieveLastFmInfo(deezerArtistName);
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
    var overlayImgPic = artist.picture_big;
    console.log(artistId, artistPicture, artistLink);
    
    var artistPlaylistUrl = 'https://widget.deezer.com/widget/dark/artist/' + artistId + '/top_tracks';
    document.getElementById('artist-playlist').src = artistPlaylistUrl;

    var mainDiv = document.querySelector('.main');
    if (overlayImgPic) {
        mainDiv.style.backgroundImage = `linear-gradient(90deg, rgba(25, 25, 25, 1), rgba(0, 0, 0, 0.7)), url('${overlayImgPic}')`;
        mainDiv.style.backgroundRepeat = 'no-repeat';
        mainDiv.style.backgroundSize = '500px';
        mainDiv.style.backgroundPosition = 'top right';
    }
  
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

    saveArtistHistory(artistName, artistPicture);
}

function printLastInfo(artist) {
    var artistBioText = 'About ' + artist.name;
    var artistBioContent = artist.bio.summary.split('<a')[0];
    var artistBioLink = artist.bio.links.link.href;
    var artistBioPub = artist.bio.published;
    var artistGenre = artist.tags.tag[0].name;
    var artistListeners = artist.stats.listeners;

    var artistBioCard = document.createElement('div');
    artistBioCard.setAttribute('class', '');

    var artistBioTitle = document.createElement('h2');
    artistBioTitle.textContent = artistBioText;

    var artistBio = document.createElement('p');
    artistBio.textContent = artistBioContent;
    artistBio.setAttribute('class', 'py-1');

    var artistDetailsContainer = document.createElement('div');
    artistDetailsContainer.setAttribute('class', 'artist-details');

    var artistGenreInfo = document.createElement('span');
    artistGenreInfo.innerHTML = 'Genre<br>' + artistGenre;

    var artistListenersInfo = document.createElement('span');
    artistListenersInfo.innerHTML = 'Listeners<br>' + artistListeners;

    artistDetailsContainer.appendChild(artistGenreInfo);
    artistDetailsContainer.appendChild(artistListenersInfo);

    var artistBioUrlContainer = document.createElement('div');
    artistBioUrlContainer.setAttribute('class', 'bio-url-container');
    var artistBioUrl = document.createElement('a');
    artistBioUrl.setAttribute('href', artistBioLink);
    artistBioUrl.setAttribute('class', 'clear-bottom');
    artistBioUrl.textContent = 'For the full bio on ' + artist.name + ' on Last.FM, click here.';
    artistBioUrlContainer.appendChild(artistBioUrl);

    artistBioCard.appendChild(artistBioTitle);
    artistBioCard.appendChild(artistBio);
    artistBioCard.appendChild(artistDetailsContainer);
    artistBioCard.appendChild(artistBioUrlContainer);

    var artistBioEl = document.getElementById('artist-bio');
    artistBioEl.innerHTML = '';
    artistBioEl.appendChild(artistBioCard);

    var artistSimilarArr = artist.similar.artist;
    console.log(artistSimilarArr);

    var similarArtistsEl = document.getElementById('similar-artists');
    similarArtistsEl.innerHTML = '';

    for (var i = 0; i < artistSimilarArr.length; i++) {
        var similarArtist = artistSimilarArr[i].name;
        console.log('Similar Artist:', similarArtist);

        var similarArtistTile = document.createElement('a');
        similarArtistTile.setAttribute('class', 'artist-tile cell-2 pr-2 border-black flex-justify-center flex-align-center hover-effect');
        similarArtistTile.setAttribute('id', similarArtist);
        similarArtistTile.setAttribute('href', '#');
        similarArtistTile.setAttribute('data-effect', 'hover-zoom-right');
        similarArtistTile.style.textDecoration = 'none';

        var similarArtistImg = document.createElement('img');
        similarArtistImg.setAttribute('class', 'tile-img slide-front');

        var similarArtistName = document.createElement('h5');
        similarArtistName.setAttribute('class', 'artist-name slide-back text-center p-4');
        similarArtistName.setAttribute('style', 'text-decoration:none !important; color: black; text-decoration-line: none;');
        similarArtistName.textContent = similarArtist;
        similarArtistName.setAttribute('id', similarArtist);

        similarArtistTile.appendChild(similarArtistImg);
        similarArtistTile.appendChild(similarArtistName);
        similarArtistsEl.appendChild(similarArtistTile);

        console.log('Similar Artist', similarArtistTile);
        similarArtistTile.addEventListener('click', function(event) {
            event.preventDefault();
            var artistSearch = event.target.id;
            var queryString = '?artist=' + artistSearch;
            history.pushState(null, '', queryString);

            console.log('Similar Artist Search: ', artistSearch);
            getParams();
        });

        getSimilarArtistImg(similarArtist, similarArtistImg, similarArtistTile);
    }
}
  
  function getSimilarArtistImg(similarArtist, similarArtistImg) {
    var deezerSearchUrl = 'https://deezerdevs-deezer.p.rapidapi.com/search?q=' + encodeURIComponent(similarArtist);
  
    fetch(deezerSearchUrl, deezerOptions)
        .then(function(response) {
            if (!response.ok) {
            throw new Error('Failed to fetch Similar Artist image');
            }
            return response.json();
        })
        .then(function(result) {
            if (result.data && result.data.length > 0) {
            console.log(similarArtist, result);
            var deezerSimilarArtistMatch = result.data.find(function(artist) {
                var decodedSearch = decodeURIComponent(similarArtist).toLowerCase();
                var decodedArtistName = decodeURIComponent(artist.artist.name).toLowerCase();
                return decodedSearch === decodedArtistName;
            });
    
            if (deezerSimilarArtistMatch) {
                console.log('Similar Artist found:', deezerSimilarArtistMatch.artist.name);
                var similarArtistImgSrc = deezerSimilarArtistMatch.artist.picture_medium;
                similarArtistImg.setAttribute('src', similarArtistImgSrc);
                similarArtistImg.setAttribute('id', similarArtist);

            } else {
                console.log('No artist found for', similarArtist);
            }
            } else {
            console.log('No similar artist data found');
            }
        })
        .catch(function(error) {
            console.log('Similar artist error:', error);
        });
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
                tourDatesEl.innerHTML = '';
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
  
    if (tourDates.length === 0) {
        var noTourDatesMessage = document.createElement('li');
        noTourDatesMessage.textContent = 'No tour dates available.';
        tourDatesEl.appendChild(noTourDatesMessage);
        return;
    }
  
    tourDates.sort(function(a, b) {
        var dateA = new Date(a.dates.start.dateTime);
        var dateB = new Date(b.dates.start.dateTime);
        return dateA - dateB;
    });
  
    for (var i = 0; i < tourDates.length; i++) {
        var tourDateName = tourDates[i].name;
        var tourDate = dayjs(tourDates[i].dates.start.dateTime).format('dddd, MMMM D, YYYY, h:mm A');
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
  
        tourDateNameEl.textContent = tourDateName;
        tourDateLocEl.textContent = tourDateLocation.tourDateVenue + ', ' + tourDateLocation.tourDateCity + ', ' + tourDateLocation.tourDateCountry;
        tourDateTimeEl.textContent = tourDate;
        tourDateAttrEl.textContent = 'Attractions: ';
        for (var j = 0; j < tourDateAttrArray.length; j++) {
            tourDateAttrEl.textContent += tourDateAttrArray[j].name + ', ';
        }
        tourDateAttrEl.textContent = tourDateAttrEl.textContent.slice(0, -2);
        tourDateTicketBtn.textContent = 'Get Tickets';
        tourDateTicketBtn.setAttribute('class', 'place-right');
    
        (function(url) {
            tourDateTicketBtn.addEventListener('click', function() {
            window.open(url, '_blank');
            });
        })(tourDateTicketUrl);
  
        tourDateEl.setAttribute('class', 'tour-date-el border-bottom border-size-2 bd-gray pb-10');
    
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

    var queryString = './searchpage.html?searchlocation=' + encodeURIComponent(searchLocation) + '&startdate=' + encodeURIComponent(startDate) + '&enddate=' + encodeURIComponent(endDate);
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
  
    var queryString = './searchpage.html?artist=' + encodeURIComponent(artistSearch);
  
    localStorage.setItem('artistSearch', artistSearch);
    location.assign(queryString);
  
    artistSearchEl.value = '';
}

function readArtistHistory() {
    var artistSearches = localStorage.getItem('artistSearches');
    if (artistSearches) {
        artistSearches = JSON.parse(artistSearches);
        renderArtistHistory(artistSearches);
    } else {
        artistSearches = [];
    }
    return artistSearches;
}

function renderArtistHistory(artistSearches) {
    artistHistoryEl.innerHTML = '';
    artistHistoryEl.setAttribute('class', 'grid')

    for (var i = 0; i < artistSearches.length; i++) {
        var artistHistoryTile = document.createElement('a');
        artistHistoryTile.setAttribute('class', 'artist-tile hover-effect');
        artistHistoryTile.setAttribute('id', artistSearches[i].artist);
        artistHistoryTile.setAttribute('href', '#');
        artistHistoryTile.setAttribute('data-effect', 'hover-zoom-right');
        artistHistoryTile.style.textDecoration = 'none';

        var artistContainer = document.createElement('div');
        artistContainer.setAttribute('class', 'row flex-align-center');

        var artistHistoryImg = document.createElement('img');
        artistHistoryImg.setAttribute('class', 'cell-4 tile-img py-2');
        artistHistoryImg.setAttribute('src', artistSearches[i].picture);

        var artistHistoryName = document.createElement('h5');
        artistHistoryName.setAttribute('class', 'artist-history-name cell-8 pl-4');
        artistHistoryName.setAttribute('style', 'text-decoration:none !important; color: black; text-decoration-line: none;');
        artistHistoryName.textContent = artistSearches[i].artist;
        artistHistoryName.setAttribute('id', artistSearches[i].artist);

        artistContainer.appendChild(artistHistoryImg);
        artistContainer.appendChild(artistHistoryName);
        artistHistoryTile.appendChild(artistContainer);
        artistHistoryEl.appendChild(artistHistoryTile);

        artistHistoryTile.addEventListener('click', function(event) {
            event.preventDefault();
            var artistSearch = event.target.id;
            var queryString = '?artist=' + this.textContent;
            history.pushState(null, '', queryString);

            console.log('Similar Artist Search: ', artistSearch);
            getParams();
        });
    }
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

function saveArtistHistory(artistName, artistPicture) {
    var artistSearches =
        JSON.parse(localStorage.getItem('artistSearches')) || [];
    var artistSearch = {
        artist: artistName,
        picture: artistPicture,
    };
    var index = artistSearches.findIndex(
        (search) => search.artist === artistName
    );
    if (index !== -1) {
      artistSearches.splice(index, 1);
    }
  
    artistSearches.unshift(artistSearch);
  
    var maxLength = 8;
    if (artistSearches.length > maxLength) {
        artistSearches = artistSearches.slice(0, maxLength);
    }
  
    localStorage.setItem('artistSearches', JSON.stringify(artistSearches));
    console.log(artistSearches);
    renderArtistHistory(artistSearches);
}

if (eventSearchBtn){
    eventSearchBtn.addEventListener('click', handleEventSearch);
    console.log(eventSearchBtn);
  }
  
if (artistSearchForm) {
    artistSearchForm.addEventListener('submit', handleArtistSearch);
    console.log(artistSearchForm);
}

function getParams() {
    console.log(document.location);
    if (document.location.search.includes('artist')) {
        var artistSearch = document.location.search.split('=').pop();
        console.log(artistSearch);
    
        retrieveDeezerInfo(artistSearch);
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

readArtistHistory();
getParams();