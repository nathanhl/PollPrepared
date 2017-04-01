
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

    var searchByName = GetURLParameter('name');

    var zipcodeSearch = GetURLParameter('zipcode');

    var arrayLocation = GetURLParameter('array');

    function nameNewsSearch() {

        var queryURL = "https://api.cognitive.microsoft.com/bing/v5.0/news/search?q=" + searchByName + "&count=3&mkt=en-US&safeSearch";

        $.ajax({
                url: queryURL,
                method: "GET",
                headers: {
                    "Ocp-Apim-Subscription-Key": "e2879149c1af48e98f8792be3d25090c",
                }
            })
            .done(function(response) {

                console.log(response);
                value = response.value;

                for (var i = 0; i < value.length; i++) {

                    var newsResponseDiv = $("<div>");

                    var headlineArray = value[i].name;
                    var newsUrl = value[i].url;

                    newsResponseDiv.attr("news-search", newsUrl);

                    newsResponseDiv.addClass("newsResultDiv");

                    newsResponseDiv.append(headlineArray + "<br><br>");

                    $("#collapse4").append(newsResponseDiv);

                };

                $(".newsResultDiv").on("click", function() {
                    event.preventDefault();

                    var clickUrl = $(this).attr("news-search");

                    window.location.href = clickUrl;
                });

            });

    };



    $(document).on("load", nameNewsSearch());

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
            };
        };
    };

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

                var title = myOffices[arrayLocation].name;

                var responseDiv = $("<div class='item'>");

                var politicianName = myOffices[arrayLocation].officials[0].name;

                var politicianParty = myOffices[arrayLocation].officials[0].party;

                var politicianPhone = myOffices[arrayLocation].officials[0].phones[0];

                var addressLine1 = myOffices[arrayLocation].officials[0].address[0].line1;
                var addressLine2 = myOffices[arrayLocation].officials[0].address[0].line2;
                var addressCity = myOffices[arrayLocation].officials[0].address[0].city;
                var addressState = myOffices[arrayLocation].officials[0].address[0].state;
                var addressZip = myOffices[arrayLocation].officials[0].address[0].zip;

                var politicianAddress = "Address: <br>" + addressLine1 + "<br>" + addressLine2 + "<br>" + addressCity + "<br>" + addressState + "<br>" + addressZip + "<br> <br> Phone: <br>" + politicianPhone;

                var personImage = $("<img>");
                personImage.attr("src", myOffices[arrayLocation].officials[0].photoUrl);

                $("#politician-photo").prepend(personImage);
                $("#politician-name").text(politicianName);
                $("#collapse1").html(politicianAddress);
                $("#politician-title").html(title + "<br>" + politicianParty);

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
