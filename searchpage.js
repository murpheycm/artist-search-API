var ArtistName = document.querySelector("#Artist-name");
var searchbutton = document.querySelector("#searchsubmitbutton")



    var user = {
      ArtistName: ArtistName
      
    };
 
    localStorage.setItem("user", JSON.stringify(user));
    
