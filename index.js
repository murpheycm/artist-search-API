var artistSearch = '';
var eventSearchBtn = document.querySelector('#event-search-btn');
var artistSearchForm = document.querySelector('#artist-search form');
var locationEl = document.getElementById('location-input');
var endDateEl = document.getElementById('end-date');
var startDateEl = document.getElementById('start-date');
var artistSearchEl = document.getElementById('search-artist-input');
var artistSelectionEl = document.getElementById('artist-selection');
var deezerOptions = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '1f74ad6fe1msh722b05fd40167f7p168350jsn83917ae41088',
      'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
    }
};

// function handleEventSearch(event) {
//     event.preventDefault();
  
    
//       var searchLocation = locationEl.value;
//       var startDate = startDateEl.value;
//       var endDate = endDateEl.value;
  
    
//         if (!location || !startDate || !endDate) {
//           console.error('You need a search input value!');
//           alert('Please enter a Location, Start Date, and End Date!')
//           return;
//         }
      
//         var queryString = './searchpage.html?searchlocation=' + searchLocation + '&startdate=' + startDate + '&enddate=' + endDate;
      
//       location.assign(queryString);
//       locationEl.value = "";
//       startDateEl.value = "";
//       endDateEl.value = "";
//   }

function handleArtistSearch(event) {
    event.preventDefault();

    var artistSearch = artistSearchEl.value;

    if (!artistSearch) {
        console.error('You need a search input value!');
        alert('Please Enter an Artist')
        return;
    }
    retrieveDeezerInfo(artistSearch);

    artistSearch = '';
    artistSearchEl.value = '';
    // var queryString = './searchpage.html?artist=' + artistSearch;
  
    // location.assign(queryString);
  
    // artistSearchEl.value = "";
}
  
function retrieveDeezerInfo(artistSearch) {
  var deezerSearchUrl =
    'https://deezerdevs-deezer.p.rapidapi.com/search?q=artist:"' + artistSearch + '"';

  fetch(deezerSearchUrl, deezerOptions)
    .then(function(response) {
        return response.json();
    })
    .then(function(result) {
        console.log(result);

        var deezerArtistMatches = result.data.filter(function(artist) {
            var decodedSearch = decodeURIComponent(artistSearch).toLowerCase().replace(/[^\w\s-]/g, '');
            var decodedArtistName = decodeURIComponent(artist.artist.name).toLowerCase().replace(/[^\w\s-]/g, '');

            var searchWords = decodedSearch.split(/\s+/);
            var artistWords = decodedArtistName.split(/\s+/);

            return searchWords.every(function(word) {
                return artistWords.some(function(artistWord) {
                   return artistWord.includes(word);
                    });
                });
             });

      if (deezerArtistMatches.length > 0) {
        console.log('Deezer Artist Matches: ', deezerArtistMatches);

        var artistMatches = [];

        while (artistMatches.length < 5 && deezerArtistMatches.length > 0) {
          var artist = deezerArtistMatches.shift(); 
          var artistName = artist.artist.name;

          if (!artistMatches.some(function(match) {
              return match.artist.name === artistName;
          })) {
              artistMatches.push(artist);
          }
        }

        console.log('Artist Matches: ', artistMatches);

        printSearchArr(artistMatches);
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

function printSearchArr(topMatches) {
    for (var i = 0; i < topMatches.length; i++) {
        var artistSearch = topMatches[i].artist;
        console.log('Top Matches Artist', artistSearch);

        var artistSearchTile = document.createElement('a');
        artistSearchTile.setAttribute('class', 'artist-tile cell-2 pr-2 border-black flex-justify-center flex-align-center hover-effect');
        artistSearchTile.setAttribute('id', artistSearch);
        artistSearchTile.setAttribute('href', '#');
        artistSearchTile.setAttribute('data-effect', 'hover-zoom-right');
        artistSearchTile.style.textDecoration = 'none';

        var artistSearchImg = document.createElement('img');
        artistSearchImg.setAttribute('class', 'tile-img slide-front mt-10');
        artistSearchImg.setAttribute('src', artistSearch.picture_medium);
        artistSearchImg.setAttribute('id', artistSearch.name);

        var artistSearchName = document.createElement('h5');
        artistSearchName.setAttribute('class', 'artist-name slide-back text-center p-2');
        artistSearchName.setAttribute('style', 'text-decoration:none !important; color: black; text-decoration-line: none;');
        artistSearchName.textContent = artistSearch.name;
        artistSearchName.setAttribute('id', artistSearch);

        artistSearchTile.appendChild(artistSearchImg);
        artistSearchTile.appendChild(artistSearchName);
        artistSelectionEl.appendChild(artistSearchTile);

        console.log('Similar Artist', artistSearchTile);
        artistSearchTile.addEventListener('click', function(event) {
            event.preventDefault();
            var artistSearch = event.target.id;
             var queryString = './searchpage.html?artist=' + artistSearch;
            window.open(queryString);
      });
    }
}



// if (eventSearchBtn) {
//   eventSearchBtn.addEventListener('click', handleEventSearch);
//   console.log(eventSearchBtn);
// }

if (artistSearchForm) {
  artistSearchForm.addEventListener('submit', handleArtistSearch);
  console.log(artistSearchForm);
}
