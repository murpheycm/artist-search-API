const config = {
  async: true,
  crossDomain: true,
  url : 'https://deezerdevs-deezer.p.rapidapi.com/search',
  method: "GET",
  cache: "reload",
  headers: {
    'X-RapidAPI-Key': '1f74ad6fe1msh722b05fd40167f7p168350jsn83917ae41088',
    'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com',
    }
}

const eventSearchBtn = document.getElementById('event-search-btn');
const artistSearchForm = document.querySelector('#search-artist-input');
// const locationEl = document.getElementById('location-input');
// const endDateEl = document.getElementById('end-date');
// const startDateEl = document.getElementById('start-date');
var artistSearchEl = document.getElementById('search-input').value;
var artistSearchUrl = 'https://api.deezer.com/search?q='+ artistSearchEl.value;

//Click handler for the Artist Search button to return artist name and information.
function saveSearch(event) {
  var artistSearchEl = document.getElementById('search-input').value;
  
  sessionStorage.setItem('artistName',artistSearchEl);
  var artistNameValue = sessionStorage.getItem('artistName');
  console.log(artistNameValue);
  document.getElementById('userSearchInput').innerHTML = artistNameValue;
  var artistNameUrl = 'https://api.deezer.com/search?q='+ artistNameValue;
  console.log(artistNameUrl);
  event.preventDefault();


<<<<<<< HEAD:searchpage/searchpage.js
  
//   function deezer() {
//     var test = $.ajax({
//       async: true,
//       crossDomain: true,
//       url:'https://deezerdevs-deezer.p.rapidapi.com/search',
//       method: "GET",
//       headers: {
//         'X-RapidAPI-Key': '1f74ad6fe1msh722b05fd40167f7p168350jsn83917ae41088',
//         'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com',
//         },
//       data: {
//         'q': artistNameValue
//       },
//       dataType: 'json',
//       success: function(result) {
//         console.log(result);
//       }
      
//     }).responseJSON;
//    console.log(test)
//   }

//   document.getElementById('artistBio').innerHTML = deezer();

// };

    async function deezer() {
      var test = await $.ajax({
        async: true,
        crossDomain: true,
        url:'https://deezerdevs-deezer.p.rapidapi.com/search',
        method: "GET",
        headers: {
          'X-RapidAPI-Key': '1f74ad6fe1msh722b05fd40167f7p168350jsn83917ae41088',
          'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com',
          },
        data: {
          'q': artistNameValue
        },
        dataType: 'json',
        // success: function(result) {
        //   // console.log(result);
        // }
        
      })
      console.log(test)
      return test
    }
    deezer();
    document.getElementById('artistBio').innerHTML = test;


};



  //     return response.json();
  //   }).then(data => {
  //       console.log(data);
  // })
  // .catch(error => {
  //     console.log(error);
  // })
//   userSearchText = localStorage.getItem("artistName");
// }
=======
  // function deezer(){
  function deezer() {
    $.ajax({
      "async": true,
      "crossDomain": true,
      "url":'https://deezerdevs-deezer.p.rapidapi.com/search',
      "method": "GET",
      "headers": {
        'X-RapidAPI-Key': '1f74ad6fe1msh722b05fd40167f7p168350jsn83917ae41088',
        'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com',
        },
      data: {
        'q': artistNameValue
      },
      success: function (result) {
        console.log(result.data);
      }
    });
  }
  document.getElementById('artistBio').innerHTML = deezer();
  
  //$.get('https://deezerdevs-deezer.p.rapidapi.com/search').then((data) => {
      //   const artistInfo = $('#artistBio');
      //   const artistData = data.name;
      //   artistInfo.append(artistData);
      // }).catch ((error) => {
      //     artistInfo.append(error.statusText);
      // })
  
};


>>>>>>> 4f2393f13a9a95edf00f5c5e783150f314a70447:searchpage.js





// Function to retrieve artist information
// function retrieveArtistInfo() {
    // async function getAPI() {
    //     const response = await fetch(artistSearchUrl, options);
    //     const data = await response.json();
    //     console.log(data);
    // };
    // getAPI(artistSearchUrl);

    // var artistName = data.list[0].artist.name;
    // var artistID = data.list[0].artist.id;

    // if (artistSearch !== artistName) {
    //     console.log('artist search error');
    //     alert('Error: Artist not found');
    // } else {
    //   console.log('It works!')
    // getSimilarArtists(artistId);
    // renderArtistInfo(artistName, data.list[0]);
    // renderPlaylist(data.list);
// };

// // retrieveArtistInfo();
// fetch(artistSearchUrl, options)
//   .then(function(response)){
//     if (!response.ok) {
//       throw response.json();
//     }
//     return response.json();
//   }




// Event handler for searchbar function
// function handleEventSearch(event) {
//     event.preventDefault();

//     var eventSearch = {
//         searchLocation: locationEl.value,
//         startDate: startDateEl.value,
//         endDate: endDateEl.value
//     };
//     saveEventHistory(eventSearch);

//     locationEl.value = "";
//     startDateEl.value = "";
//     endDateEl.value = "";

//     return false;
// }

// function handleArtistSearch(event) {

//     event.preventDefault();
  
//     var artistSearch = artistSearchEl.value;
    
//     saveArtistHistory(artistSearch);
//     retrieveArtistId(artistSearch);
    
//     artistSearchEl.value = "";
  
//     return false;
// }

// function saveEventHistory() {
//     var eventSearches = JSON.parse(localStorage.getItem('eventSearches')) || [];
//     eventSearches.push(eventSearches);
//     localStorage.setItem('eventSearches', JSON.stringify(eventSearches));
//     console.log(eventSearches);
// }

// function saveArtistHistory() {
//     var artistSearches = JSON.parse(localStorage.getItem('artistSearches')) || [];
//     artistSearches.push(artistSearch);
//     localStorage.setItem('artistSearches', JSON.stringify(artistSearches));
//     console.log(artistSearches);
//     retrieveArtistId(artistSearch);

// }


  
// //Event listener for search button
// if (eventSearchBtn) {
//   eventSearchBtn.addEventListener('click', handleEventSearch);
//   console.log(eventSearchBtn);
// }

// if (artistSearchForm) {
//   artistSearchForm.addEventListener('submit', handleArtistSearch);
//   console.log(artistSearchForm);
// }

// function getParams() {
//     console.log(document.location)
//     if (searchPageUrl.includes('artist')) {
//         var artistSearch = document.location.search.split('=');
//         console.log(artistSearch);

//         saveArtistHistory(artistSearch);
//     } else if (searchPageUrl.includes('searchlocation')) {
//         var eventSearch = document.location.search.split('&');

//         var searchLocation = eventSearch[0].split('=').pop();
//         var startDate = eventSearch[1].split('=').pop();
//         var endDate = eventSearch[2].split('=').pop();
//         console.log(eventSearch);

//         saveEventHistory(eventSearch);
//     } else {
//         return;
//     }
    
// };

// getParams()
