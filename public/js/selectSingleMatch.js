//This file is the JavaScript needed to select a single match and display their user profile

$(document).ready(function () {

$(this).on('click', ".profile-button", function() {
    event.preventDefault();

    var matchId = {
        id: $(this).val()
    };

    //AJAX call
    $.ajax('/transfer', {
        method: "POST",
        data: matchId,
        success: function (res) {
            if (res.redirect !== undefined) {
                window.location.href = res.redirect_url
            }
        }
    });

});

});