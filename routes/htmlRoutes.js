var db = require("../models");

module.exports = function (app) {
  // Load index page-landing page
  app.get("/", function (req, res) {
    res.render("index", {});

  });

  //login page
  app.get("/login", function (req, res) {
    res.render("login", {
    });

  });

  //signup page
  app.get("/signup", function (req, res) {
    res.render("signup", {
    });

  });

  //survey route
  app.get("/survey", authenticationMiddleware(), function (req, res) {
    res.render("survey", {
    });
  });

  //Route to show the user thier matches
  app.get("/matches", authenticationMiddleware(), function (req, res) {
    var matchesObject = {
      matchesArray: []
    };

    //get id of current user
    var currentUser = req.user;

    //Sequelize database call for current user
    db.User.findOne({
      where: { id: currentUser }
    }).then(function (userInfo) {

      //Sequelize database call for all users
      db.User.findAll({}).then(function (allUsers) {
        //loop to compare all users to the current user and populate the matches
        for (i = 0; i < allUsers.length; i++) {
          if (currentUser !== allUsers[i].id) {

            var matchCompatibility = 0;
            var userResponse = createAnswerArray(userInfo);
            var allResponse = createAnswerArray(allUsers[i]);

            //check answers of user vs a single other user
            for (j = 0; j < allResponse.length; j++) {
              if (allResponse[j] == userResponse[j]) {
                matchCompatibility = matchCompatibility + 1;
              };

            };//close j loop through questions

            //adds match to the user array if criteria met
            if (matchCompatibility > 5) {

              allUsers[i].compatibility = matchCompatibility;

              matchesObject.matchesArray.push(allUsers[i]);

            };//end match compatibility check
          };//end check to ensure user is not compared to their own survey
        }; //close i loop through questions
      }).then(function () {
        res.render("matches", matchesObject);
      });
    });
  });

  //Route to access individual profiles
  app.get("/profile/:id", authenticationMiddleware(), function (req, res) {
    //Sequelize databse call for the desired user profile
    db.User.findOne({
      include: [{
        model: db.Review
      }],
      where: {
        id: req.params.id
      }
    }).then(function (dbMatch) {
      res.render("profile", dbMatch);
    });
  });


  //add Review
  app.get("/matches/:id/addreview", function (req, res) {
    res.render("addreview", {
    });
  });


  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};// end module.exports


//Authentication check function
function authenticationMiddleware() {
  return (req, res, next) => {

    if (req.isAuthenticated()) return next();

    res.redirect('/login');
  };
};


//create an array of question responses from the object returned from the database
function createAnswerArray(databaseObject, answerArray) {
  var answerArray = [];

  answerArray.push(databaseObject.question1);
  answerArray.push(databaseObject.question2);
  answerArray.push(databaseObject.question3);
  answerArray.push(databaseObject.question4);
  answerArray.push(databaseObject.question5);
  answerArray.push(databaseObject.question6);
  answerArray.push(databaseObject.question7);
  answerArray.push(databaseObject.question8);
  answerArray.push(databaseObject.question9);
  answerArray.push(databaseObject.question10);

  return answerArray;

}; //end create answer array


