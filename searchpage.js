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
const spotifyClientId = '676cb4ae768d4cd19ae9209e52d3eca3';
const spotifySecret = '9c94680f82034896b6f228fbba603725';
var eventSearchBtn = document.querySelector('#event-search-btn');
var artistSearchForm = document.getElementById('artist-search-form');
var locationEl = document.getElementById('location-input');
var endDateEl = document.getElementById('end-date');
var startDateEl = document.getElementById('start-date');
var artistSearchEl = document.getElementById('search-artist-input');
var similarArtistTiles = document.querySelectorAll('.artist-tile')
var artistHistoryEl = document.getElementById('artist-history');
var tourDatesEl = document.getElementById('tour-date-wrapper');

// Function to retrieve artist information
function retrieveArtistInfo(artistSearch) {
    var deezerPromise = retrieveDeezerInfo(artistSearch)
        .catch(function(error) {
            console.log('Error retrieving Deezer info:', error);
            return null;
        });

    var lastFmPromise = retrieveLastFmInfo(artistSearch)
        .catch(function(error) {
            console.log('Error retrieving Last.fm info:', error);
            return null;
        });

    var spotifyPromise = retrieveSpotifyInfo(artistSearch)
        .catch(function(error) {
            console.log('Error retrieving Spotify info:', error);
            return null;
        });

    var wikipediaPromise = retrieveWikipediaInfo(artistSearch)
        .catch(function(error) {
            console.log('Error retrieving Wikipedia info:', error);
            return null;
        });

    Promise.all([deezerPromise, lastFmPromise, spotifyPromise, wikipediaPromise])
        .then(function(results) {
            var artistData = {
                deezer: results[0],
                lastFm: results[1],
                spotify: results[2],
                wikipedia: results[3]
            };

            // Process artist data
            console.log(artistData);
            getArtistInfo(artistData);
        })
        .catch(function(error) {
            console.log('Error retrieving Artist Information: ', error);
        });
}

function retrieveDeezerInfo(artistSearch) {
    console.log('Calling retrieveDeezerInfo');
    var deezerSearchUrl = 'https://deezerdevs-deezer.p.rapidapi.com/search?q=artist:"' + artistSearch + '"';
  
    return fetch(deezerSearchUrl, deezerOptions)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Failed to retrieve Deezer info');
            }
            return response.json();
        })
        .then(function(result) {
            console.log(result);
            if (result.data && result.data.length > 0) {  
                var deezerMatch = result.data.find(function(artist) {
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
  
                if (deezerMatch) {
                    console.log('Deezer Artist Match: ', deezerMatch.artist.name);
                    return deezerMatch;
                } else {
                    console.log('Artist not found in Deezer');
                    return null;
                }
            } else {
                console.log('No data found in Deezer');
                return null;
            }
        })
        .catch(function(error) {
            console.log('Error:', error);
            return null;
        });
}

function retrieveLastFmInfo(artistSearch) {
    console.log('Calling retrieveLastFmInfo');
    var lastUrl = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + artistSearch + '&api_key=' + lastApiKey + '&format=json';

    return fetch(lastUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            console.log(result);
            if (result.artist) {
                var lastFmMatch = result.artist;
                var decodedSearch = decodeURIComponent(artistSearch).toLowerCase().replace(/[^\w\s-]/g, '');
                var decodedArtistName = lastFmMatch.name.toLowerCase().replace(/[^\w\s-]/g, '');

                var searchWords = decodedSearch.split(/\s+/);
                var artistWords = decodedArtistName.split(/\s+/);

                var match = searchWords.every(function(word) {
                    return artistWords.some(function(artistWord) {
                        return artistWord.includes(word);
                    });
                });

                if (match) {
                    console.log('Last.fm Artist Match:', lastFmMatch.name);
                    return lastFmMatch;
                } else {
                    console.log('Artist not found in Last.fm');
                    return null;
                }
            } else {
                console.log('Artist not found in Last.fm');
                return null;
            }
        })
        .catch(function(error) {
            console.log('Error:', error);
            return null;
        });
}

function retrieveSpotifyInfo(artistSearch) {
    console.log('Calling retrieveSpotifyInfo');
    var spotifyUrl = 'https://api.spotify.com/v1/search?q=' + artistSearch + '&type=artist';
    const spotifyOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + btoa(spotifyClientId + ':' + spotifySecret)
        },
        form: {
            grant_type: 'client_credentials'
        },
        json: true
    };

    return fetch(spotifyOptions.url, {
        method: 'POST',
        headers: {
            'Authorization': spotifyOptions.headers.Authorization
        },
        body: new URLSearchParams(spotifyOptions.form)
    })
        .then(function(response) {
            return response.json();
        })
        .then(function(tokenResponse) {
            const token = tokenResponse.access_token;
            const spotifySearchOptions = {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            };

            return fetch(spotifyUrl, spotifySearchOptions)
                .then(function(response) {
                    return response.json();
                })
                .then(function(result) {
                    console.log(result);
                    if (result.artists && result.artists.items.length > 0) {
                        var spotifyMatch = result.artists.items.find(function(artist) {
                            var decodedSearch = decodeURIComponent(artistSearch).toLowerCase().replace(/[^\w\s-]/g, '');
                            var decodedArtistName = artist.name.toLowerCase().replace(/[^\w\s-]/g, '');

                            var searchWords = decodedSearch.split(/\s+/);
                            var artistWords = decodedArtistName.split(/\s+/);

                            return searchWords.every(function(word) {
                                return artistWords.some(function(artistWord) {
                                    return artistWord.includes(word);
                                });
                            });
                        });
                        if (spotifyMatch) {
                            console.log('Spotify Artist Match: ', spotifyMatch.name);
                            return spotifyMatch;
                        } else {
                            console.log('Artist not found in Spotify');
                            return null;
                        }
                    } else {
                        console.log('Artist not found in Spotify');
                        return null;
                    }
                })
                .catch(function(error) {
                    console.log('Spotify Error:', error);
                    return null;
                });
        })
        .catch(function(error) {
            console.log('Spotify Error', error);
            return null;
        });
}

function getArtistSearchTerm(artistData) {
    return (
      artistData.spotify?.name ||
      artistData.lastFm?.name ||
      artistData.deezer?.name ||
      null
    );
  }

  function retrieveWikipediaInfo(artistSearch) {
    console.log('Calling retrieveWikipediaInfo');
    const wikipediaSearchUrl = `https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&list=search&srsearch=${encodeURIComponent(artistSearch)}`;

    return fetch(wikipediaSearchUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(result) {
            console.log(result);

            if (result.query && result.query.search && result.query.search.length > 0) {
                const searchResults = result.query.search;

                const match = searchResults.find((searchResult) =>
                    searchResult.title.toLowerCase().includes(artistSearch.toLowerCase())
                );

                if (match) {
                    console.log('Exact Wikipedia Match:', match.title);
                    console.log('Snippet:', match.snippet);
                    console.log('Link:', `https://en.wikipedia.org/wiki/${match.title}`);
                    return{
                        title: match.title,
                        snippet: match.snippet,
                        link: `https://en.wikipedia.org/wiki/${match.title}`
                    }
                } else {
                    console.log('No exact Wikipedia match found');
                }
            } else {
                console.log('No Wikipedia search results found');
            }
        })
        .catch(function(error) {
            console.log('Wikipedia Error:', error);
        });
}
  

function getArtistInfo(artistData) {
    console.log('Calling getArtistInfo');
    var artist = {
        name: getArtistName(artistData),
        deezerId: getArtistId(artistData),
        picture: getArtistPicture(artistData),
        bio: getArtistBio(artistData),
        wikipediaBio: '',
        genre: getArtistGenre(artistData),
        listeners: getArtistListeners(artistData),
        similarArtists: getSimilarArtists(artistData),
        spotifyLink: getSpotifyLink(artistData),
        itunesLink: '',
        wikipediaLink: ''
    };

    function getArtistName(artistData) {
        return artistData.deezer?.name || artistData.lastFm?.name || artistData.spotify?.name || '';
    }

    function getArtistId(artistData) {
        return artistData.deezer?.artist.id || '';
    }

    function getArtistPicture(artistData) {
        if (artistData.deezer) {
          return artistData.deezer.artist.picture_medium || '';
        } else if (artistData.lastFm) {
          return artistData.lastFm.artist.image?.pop()['#text'] || '';
        } else if (artistData.spotify) {
          return artistData.spotify.images[0]?.url || '';
        } else {
          return '';
        }
      }

    function getArtistBio(artistData) {
        return artistData.lastFm?.bio?.summary || '';
    }

    function getArtistGenre(artistData) {
        return artistData.lastFm?.tags?.tag[0]?.name || artistData.spotify?.genres?.[0] || '';
    }

    function getArtistListeners(artistData) {
        return artistData.lastFm?.stats?.listeners || artistData.spotify?.followers?.total || '';
    }

    function getSimilarArtists(artistData) {
        var similarArtists = [];
      
        if (artistData.deezer?.similar?.artist) {
            similarArtists = artistData.deezer.similar.artist;
        } else if (artistData.lastFm?.similar?.artist) {
            similarArtists = artistData.lastFm.similar.artist;
        } else if (artistData.spotify?.similar?.artists?.items) {
            similarArtists = artistData.spotify.similar.artists.items;
        }
        return similarArtists;
    }

    function getSpotifyLink(artistData) {
        return artistData.spotify?.external_urls?.spotify || '';
    }

    function getItunesLink(artistData) {
        const artistName = getArtistName(artistData);
        if (artistName) {
          return retrieveItunesLink(artistName);
        }
        return Promise.resolve(null);
    }

    var artistName = artist.name;
    var artistPicture = artist.picture;
    var artistGenre = artist.genre;
    retrieveWikipediaInfo(artistName, artistGenre)
        .then(function(wikipediaData) {
            if (wikipediaData) {
                artist.wikipediaBio = wikipediaData.snippet;
                artist.wikipediaLink = wikipediaData.link;
            }
            return getItunesLink(artistData);
        })
            .then(function(itunesLink) {
                artist.itunesLink = itunesLink;
                console.log('artist array', artist);
                saveArtistHistory(artistName, artistPicture);
                retrieveTourDates(artist.name);
                printArtistInfo(artist);
        })
        .catch(function(error) {
            console.log('Error retrieving Wikipedia info:', error);
            saveArtistHistory(artistName, artistPicture);
            retrieveTourDates(artistName);
            printArtistInfo(artist);
        });
}

function retrieveItunesLink(artistName) {
    console.log('calling retrieveItunesLink');
    const itunesSearchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(artistName)}&entity=musicArtist&limit=1`;
  
    return fetch(itunesSearchUrl)
      .then(function(response) {
        console.log('itunes', response);
        return response.json();
      })
      .then(function(result) {
        if (result.results && result.results.length > 0) {
          console.log('itunes result', result);
          const artistResult = result.results[0];
          const itunesLink = artistResult.artistLinkUrl;
          return itunesLink;
        } else {
          console.log('No iTunes search results found');
          return null;
        }
      })
      .catch(function(error) {
        console.log('iTunes Search Error:', error);
        return null;
      });
  }

  function printArtistInfo(artist) {
    var artistHeaderCard = document.createElement('div');
    var artistHeaderName = document.createElement('h1');
    var artistHeaderPicture = document.createElement('img');
  
    artistHeaderName.textContent = artist.name;
    artistHeaderPicture.setAttribute('src', artist.picture);
  
    artistHeaderCard.appendChild(artistHeaderPicture);
    artistHeaderCard.appendChild(artistHeaderName);
  
    var artistHeaderEl = document.getElementById('artist-header');
    if (artistHeaderEl) {
      artistHeaderEl.innerHTML = '';
      artistHeaderEl.appendChild(artistHeaderCard);
    }

    var mainDiv = document.querySelector('.main');
    if (artist.picture) {
      mainDiv.style.backgroundImage = `linear-gradient(90deg, rgba(25, 25, 25, 1), rgba(0, 0, 0, 0.7)), url('${artist.picture}')`;
      mainDiv.style.backgroundRepeat = 'no-repeat';
      mainDiv.style.backgroundSize = '600px';
      mainDiv.style.backgroundPosition = 'top right';
    }
  
    var playlistEl = document.getElementById('playlist');
  if (artist.deezerId) {
    var deezerWidgetContainer = document.createElement('iframe');
    deezerWidgetContainer.setAttribute('title', 'deezer-widget');
    deezerWidgetContainer.setAttribute('width', '60%');
    deezerWidgetContainer.setAttribute('height', '300');
    deezerWidgetContainer.setAttribute('src', `https://widget.deezer.com/widget/dark/artist/${artist.deezerId}/top_tracks`);
    deezerWidgetContainer.setAttribute('frameborder', '0');
    deezerWidgetContainer.setAttribute('allowtransparency', 'true');
    deezerWidgetContainer.setAttribute('allow', 'encrypted-media; clipboard-write');
    deezerWidgetContainer.setAttribute('id', 'artist-playlist');

    playlistEl.innerHTML = '';
    playlistEl.appendChild(deezerWidgetContainer);
  }
  
    var artistBioCard = document.createElement('div');
    var artistBioTitle = document.createElement('h2');
    artistBioTitle.textContent = 'About ' + artist.name;
  
    var artistBio = document.createElement('p');
    artistBio.innerHTML =
      artist.bio + '<br><br>' +
      'Wikipedia Bio: ' + artist.wikipediaBio + '<br><br>' +
      'Genre: ' + artist.genre + '<br>' +
      'Listeners: ' + artist.listeners + '<br><br>';

    var linkContainer = document.createElement('div');
    linkContainer.classList.add('link-container'); // Add a class for flex layout

    var spotifyLink = document.createElement('a');
    spotifyLink.setAttribute('href', artist.spotifyLink);
    spotifyLink.setAttribute('target', '_blank');
    spotifyLink.setAttribute('title', 'Spotify');
    spotifyLink.setAttribute('class', 'logo');
    spotifyLink.innerHTML = '<i class="fab fa-spotify"></i>';

    var itunesLink = document.createElement('a');
    itunesLink.setAttribute('href', artist.itunesLink);
    itunesLink.setAttribute('target', '_blank');
    itunesLink.setAttribute('class','logo');
    itunesLink.setAttribute('title', 'iTunes');
    itunesLink.innerHTML = '<i class="fab fa-itunes"></i>';

    var wikipediaLink = document.createElement('a');
    wikipediaLink.setAttribute('href', artist.wikipediaLink);
    wikipediaLink.setAttribute('target', '_blank');
    wikipediaLink.setAttribute('title', 'Wikipedia');
    wikipediaLink.setAttribute('class', 'logo')
    wikipediaLink.innerHTML = '<i class="fab fa-wikipedia-w"></i>';

    linkContainer.appendChild(spotifyLink);
    linkContainer.appendChild(itunesLink);
    linkContainer.appendChild(wikipediaLink);

    artistBioCard.appendChild(artistBioTitle);
    artistBioCard.appendChild(artistBio);
    artistBioCard.appendChild(linkContainer);
  
    var artistBioEl = document.getElementById('artist-bio');
    if (artistBioEl) {
      artistBioEl.innerHTML = '';
      artistBioEl.appendChild(artistBioCard);
    }
  
    var similarArtistsEl = document.getElementById('similar-artists');
    if (similarArtistsEl) {
      similarArtistsEl.innerHTML = '';
  
      var fetchSimilarArtistImages = artist.similarArtists.map(function (similarArtist) {
        return getSimilarArtistImg(similarArtist, similarArtistsEl);
      });
  
      Promise.all(fetchSimilarArtistImages)
        .then(function () {
          console.log('All similar artist images fetched');
          retrieveTourDates(artist);
        })
        .catch(function (error) {
          console.log('Similar artist images error:', error);
        });
    }
  }
  
  function getSimilarArtistImg(similarArtist, similarArtistsEl) {
    var deezerSearchUrl = 'https://deezerdevs-deezer.p.rapidapi.com/search?q=' + encodeURIComponent(similarArtist.name);
  
    return fetch(deezerSearchUrl, deezerOptions)
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Failed to fetch Similar Artist image');
        }
        return response.json();
      })
      .then(function(result) {
        if (result.data && result.data.length > 0) {
          var deezerSimilarArtistMatch = result.data.find(function(artist) {
            var decodedSearch = decodeURIComponent(similarArtist.name).toLowerCase();
            var decodedArtistName = decodeURIComponent(artist.artist.name).toLowerCase();
            return decodedSearch === decodedArtistName;
          });
  
          if (deezerSimilarArtistMatch) {
            console.log('Similar Artist found:', deezerSimilarArtistMatch.artist.name);
            var similarArtistImgSrc = deezerSimilarArtistMatch.artist.picture_medium;
            createSimilarArtistElement(similarArtist, similarArtistImgSrc, similarArtistsEl);
          } else {
            console.log('No artist found for', similarArtist.name);
            retrieveLastFmArtistImage(similarArtist, similarArtistsEl);
          }
        } else {
          console.log('No similar artist data found');
          retrieveLastFmArtistImage(similarArtist, similarArtistsEl);
        }
      })
      .catch(function(error) {
        console.log('Similar artist error:', error);
        retrieveLastFmArtistImage(similarArtist, similarArtistsEl);
      });
  }
  
  function retrieveLastFmArtistImage(artist, similarArtistsEl) {
    // Replace 'YOUR_LASTFM_API_KEY' with your actual Last.fm API key
    var lastFmSearchUrl = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artist.name)}&api_key=${lastApiKey}&format=json`;
  
    return fetch(lastFmSearchUrl)
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Failed to fetch Last.fm Artist image');
        }
        return response.json();
      })
      .then(function(result) {
        if (result.artist && result.artist.image && result.artist.image.length > 0) {
          console.log('Last.fm Artist image found for', artist.name);
          // Last.fm returns an array of images, we use the last image (largest size)
          var lastFmArtistImage = result.artist.image[result.artist.image.length - 1]['#text'];
          createSimilarArtistElement(artist, lastFmArtistImage, similarArtistsEl);
        } else {
          console.log('No Last.fm Artist image found for', artist.name);
        }
      })
      .catch(function(error) {
        console.log('Last.fm Artist image error:', error);
      });
  }
  
  function createSimilarArtistElement(similarArtist, imageSrc, similarArtistsEl) {
    var similarArtistTile = document.createElement('a');
    similarArtistTile.setAttribute('class', 'artist-tile cell-2 pr-2 border-black flex-justify-center flex-align-center hover-effect');
    similarArtistTile.setAttribute('href', '#');
    similarArtistTile.setAttribute('data-effect', 'hover-zoom-right');
    similarArtistTile.style.textDecoration = 'none';
  
    var similarArtistImg = document.createElement('img');
    similarArtistImg.setAttribute('class', 'tile-img slide-front');
    similarArtistImg.setAttribute('src', imageSrc);
    similarArtistImg.setAttribute('id', similarArtist.name);
  
    var similarArtistName = document.createElement('h5');
    similarArtistName.setAttribute('class', 'artist-name text-center p-4');
    similarArtistName.setAttribute('style', 'text-decoration:none !important; color: black; text-decoration-line: none;');
    similarArtistName.textContent = similarArtist.name;
    similarArtistName.setAttribute('id', similarArtist.name);
  
    similarArtistTile.appendChild(similarArtistImg);
    similarArtistTile.appendChild(similarArtistName);
    similarArtistsEl.appendChild(similarArtistTile);
  
    similarArtistTile.addEventListener('click', function(event) {
      event.preventDefault();
      var artistSearch = event.target.id;
      var queryString = '?artist=' + encodeURIComponent(artistSearch);
      history.pushState(null, '', queryString);
  
      console.log('Similar Artist Search:', artistSearch);
      getParams();
    });
  }

  function retrieveTourDates(artist) {
    console.log('Calling retrieveTourDates');
    var artistFound = Object.values(artist).some(function(value) {
      return value !== null;
    });
  
    if (!artistFound) {
      var tourDatesEl = document.getElementById('tour-dates');
      clearTourDates(tourDatesEl); // Call clearTourDates to clear previous tour dates
      return Promise.resolve([]);
    }
  
    var ticketmasterApiUrl =
      'https://app.ticketmaster.com/discovery/v2/events?apikey=tNLADXtluSf6FmnNfmVlChS3d2UQXC6G&keyword=' +
      encodeURIComponent(artist.name) +
      '&locale=*';
  
    return fetch(ticketmasterApiUrl)
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Failed to fetch tour dates');
        }
        return response.json();
      })
      .then(function(result) {
        console.log('Ticketmaster', result);
  
        var tourDatesEl = document.getElementById('tour-dates');
        clearTourDates(tourDatesEl); // Call clearTourDates to clear previous tour dates
  
        if (
          result._embedded &&
          result._embedded.events &&
          result._embedded.events.length > 0
        ) {
          console.log('Ticketmaster Response:', result);
          var tourDates = result._embedded.events.filter(function(event) {
            // Check if the artist name or one of the attractions' names exactly matches the searched artist
            return (
              event.name.toLowerCase() === artist.name.toLowerCase() ||
              event._embedded.attractions.some(function(attraction) {
                return attraction.name.toLowerCase() === artist.name.toLowerCase();
              })
            );
          });
          console.log(tourDates);
          printTourDates(tourDates, tourDatesEl);
          return tourDates;
        } else {
          return [];
        }
      })
      .catch(function(error) {
        console.log('Ticketmaster Error:', error);
        return [];
      });
  }
  
  function clearTourDates(tourDatesEl) {
    tourDatesEl.innerHTML = '';
  }
  
  
  
  function printTourDates(tourDates, tourDatesEl) {
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
      var tourDate = dayjs(tourDates[i].dates.start.dateTime).format(
        'dddd, MMMM D, YYYY, h:mm A'
      );
      var tourDateLocation = {
        tourDateVenue: tourDates[i]._embedded.venues[0].name,
        tourDateCity: tourDates[i]._embedded.venues[0].city.name,
        tourDateCountry: tourDates[i]._embedded.venues[0].country.name,
      };
      var tourDateAttrArray = tourDates[i]._embedded.attractions;
      var tourDateTicketUrl = tourDates[i].url;
      console.log(
        tourDateName,
        tourDate,
        tourDateLocation,
        tourDateAttrArray,
        tourDateTicketUrl
      );
  
      var tourDateEl = document.createElement('li');
      var tourDateNameEl = document.createElement('h2');
      var tourDateLocEl = document.createElement('p');
      var tourDateTimeEl = document.createElement('p');
      var tourDateAttrEl = document.createElement('p');
      var tourDateTicketBtn = document.createElement('button');
  
      tourDateNameEl.textContent = tourDateName;
      tourDateEl.setAttribute('class', 'pt-6');
      tourDateNameEl.setAttribute('class', 'secondary');
      tourDateLocEl.textContent =
        tourDateLocation.tourDateVenue +
        ', ' +
        tourDateLocation.tourDateCity +
        ', ' +
        tourDateLocation.tourDateCountry;
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
  
      tourDateEl.setAttribute(
        'class',
        'tour-date-el border-bottom border-size-2 bd-gray pb-10'
      );
  
      tourDateEl.appendChild(tourDateNameEl);
      tourDateEl.appendChild(tourDateLocEl);
      tourDateEl.appendChild(tourDateTimeEl);
      tourDateEl.appendChild(tourDateAttrEl);
      tourDateEl.appendChild(tourDateTicketBtn);
  
      tourDatesEl.appendChild(tourDateEl);
    }
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
        artistHistoryName.setAttribute('style', 'text-decoration:none !important; color: white; text-decoration-line: none;');
        artistHistoryName.textContent = artistSearches[i].artist;
        artistHistoryName.setAttribute('id', artistSearches[i].artist);

        artistContainer.appendChild(artistHistoryImg);
        artistContainer.appendChild(artistHistoryName);
        artistHistoryTile.appendChild(artistContainer);
        artistHistoryEl.appendChild(artistHistoryTile);

        artistHistoryTile.addEventListener('click', function(event) {
            event.preventDefault();
            var artistSearch = event.target.id;
            var queryString = '?artist=' + encodeURIComponent(this.textContent);
            history.pushState(null, '', queryString);

            console.log('Similar Artist Search: ', artistSearch);
            getParams();
        });
    }
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
    
        retrieveArtistInfo(artistSearch);
    } else {
        return;
    }
}

readArtistHistory();
getParams();