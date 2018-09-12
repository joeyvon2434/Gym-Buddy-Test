//this file adds a review to a specific user

$("#add-review-button").on('click', function() {
    event.preventDefault();

    console.log("Star Value");
    var stars =  $("input[name='reviewStars']:checked").val();
    console.log(stars);

    //pull in user inputs for reviews here
    var newReview = {
        UserId: $(this).val(),
        description: $("#description").val(), 
        rating: stars
};

//AJAX call
    $.ajax({
        method: "POST",
        url: "/review",
        data: newReview
    }).then(function() {
        console.log("made it to reload")
        location.reload();
    });
});