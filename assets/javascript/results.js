var myOffices = [];

function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
};

var zipcodeSearch = GetURLParameter('zipcode');

$("#search-script").text("Showing results for: " + zipcodeSearch);

function mapOfficialsToOffice(officials) {

    var tempIndices = [];
    var currentIndex;

    // loop through offices (x)
    for (var x = 0; x < myOffices.length; x++) {

        // for each office grab the official indeces
        tempIndices = myOffices[x].officialIndices;

        // offices[x].officials = []
        myOffices[x].officials = [];

        console.log(tempIndices)

        // loop throught those indeces (y)
        for (var y = 0; y < tempIndices.length; y++) {

            currentIndex = myOffices[x].officialIndices[y]
            myOffices[x].officials[y] = officials[currentIndex]
        }
    }
}

function getSearch() {

    var queryURL = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDiWZZJUOpyQL7T8VuIsgaCY2RIuRBW_h8&address=" + zipcodeSearch;

    $.ajax({
            url: queryURL,
            method: "GET",
        })
        .done(function(response) {
            console.log(response)
            myOffices = response.offices;
            var officials = response.officials
            mapOfficialsToOffice(officials)


            for (var i = 0; i < myOffices.length; i++) {

                var title = myOffices[i].name;

                for (var j = 0; j < myOffices[i].officials.length; j++) {

                    var responseDiv = $("<div class='item'>");

                    var politicianName = myOffices[i].officials[j].name;

                    var politicianFull = $("<p>").text(title + ": " + politicianName);
                    var personImage = $("<img>");
                    personImage.attr("src", myOffices[i].officials[j].photoUrl);

                    responseDiv.append(politicianFull);
                    responseDiv.append(personImage);

                    responseDiv.attr("click-search", politicianName);

                    responseDiv.addClass("searchResultDiv");

                    $("#display-area").append(responseDiv);

                };
            };

            $(".searchResultDiv").on("click", function() {
                event.preventDefault();

                var bioSearch = $(this).attr("click-search");

                for (var k = 0, len = officials.length; k < len; k++) {
                    if (officials[k].name === bioSearch) {
                        var arrayPlace = k; // Return as soon as the object is found
                        break;
                    }
                }

                window.location.href = "samplebio.html?zipcode=" + zipcodeSearch + "&name=" + bioSearch + "&array=" + arrayPlace;
            });
        });

};

$(document).on("load", getSearch());

$(document).ready(function() {

    $("#submitButton").on("click", function() {
        event.preventDefault();
        var searchTerm = $("#query").val().trim();

        window.location.href = "sampleresults.html?zipcode=" + searchTerm;
    });
});

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBlu1iiqinWv8ZwcpS1rlzX_AfUuXM5yPs",
    authDomain: "test-55416.firebaseapp.com",
    databaseURL: "https://test-55416.firebaseio.com",
    projectId: "test-55416",
    storageBucket: "test-55416.appspot.com",
    messagingSenderId: "842359936665"
};
firebase.initializeApp(config);


var database = firebase.database();
var databaseRef = database.ref();
var likeCounter = 0;
var dislikeCounter = 0;

$(document).ready(function() {
    $('#likeButton').on('click', function() {
        likeCounter++;
        $('#like').text(likeCounter);

        //send in JSON counter, set data. Data contectualized in database. 
        database.ref('winners').set({
            likes: likeCounter,

        });
    });

    $('#dislikeButton').on('click', function() {
        dislikeCounter++;
        $('#dislike').text(dislikeCounter);


        database.ref('losers').set({
            dislikes: dislikeCounter
        })
    });



    database.ref('winners').on('value', function(snapshot) {
        //to persist data
        if (snapshot.val().likes) {
            likeCounter = snapshot.val().likes;
        }
        //place data from firebase to html
        $('#like').text(snapshot.val().likes);
    });

    database.ref('losers').on('value', function(snapshot) {
        if (snapshot.val().dislikes) {
            dislikeCounter = snapshot.val().dislikes;
        }
        $('#dislike').text(snapshot.val().dislikes);
    });

});
