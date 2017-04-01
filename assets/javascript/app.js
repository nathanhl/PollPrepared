
    $(document).ready(function() {

        $("#submitButton").on("click", function() {
            event.preventDefault();
            var searchTerm = $("#query").val().trim();

            window.location.href = "sampleresults.html?zipcode=" + searchTerm;
        });
    });
