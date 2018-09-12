//require bcrypt as our hashing algorithm
var bcrypt = require("bcrypt");
const saltRounds = 10;

//require passport
var passport = require("passport");

//require the databse
var db = require("../models");

module.exports = function (app) {


  // Post route to add a new user to the database and send the new user to the survey page
  app.post("/api/createnewuser", function (req, res) {

    //hash the password with bcrypt for secure storage in the databse
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {

      newUser = {
        email: req.body.userEmail,
        password: hash
      };

      //use sequelize to send info to database
      db.User.create(newUser).then(function (dbUser) {

        var userId = dbUser.id;

        //logs in user if profile creation succeeds
        if (userId) {

          req.login(userId, function (err) {
            var newPath = "/survey"

            res.json({
              "redirect": true,
              "redirect_url": newPath
            });
          });
        }
      });
    });
  });//end creeate new user route


  //Log In route
  app.post("/api/authenticateuser", passport.authenticate("local", {
    successRedirect: '/matches',
    failureRedirect: '/login'
  }));


  //Log Out route
  app.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
  });


  //This route allows the user to submit their survey results for matching, then directs them to the matches page
  app.put("/api/updatesurvey", authenticationMiddleware(), function (req, res) {

    //pul in survey inputs
    var survey = req.body;
    var currentUser = req.user;

    //database update with sequelize (stores in the user table)
    db.User.update(
      survey,
      {
        where: {
          id: currentUser
        }
      }
    ).then(function (err) {
      //response with re-direct routing
      res.json({
        "redirect": true,
        "redirect_url": "/matches"
      });
    });

  });//end update api route


  //this takes in user information from the appropriate button and transsfers them to the correct individual profile route
  app.post("/transfer", authenticationMiddleware(), function (req, res) {

    var newRoute = "/profile/" + req.body.id;

    res.json({
      "redirect": true,
      "redirect_url": newRoute
    });
  });//end get individual profile route




  //This route adds a review to the database and reloads the /profile/:id page
  app.post("/review", authenticationMiddleware(), function (req, res) {


    db.Review.create(
      req.body
    ).then(function (err) {
      res.end();
    });
  });

}; // end module.exports


passport.serializeUser(function (userId, done) {
  done(null, userId);
});

passport.deserializeUser(function (userId, done) {
  done(null, userId);
});


//Function to check authentication
function authenticationMiddleware() {
  return (req, res, next) => {

    if (req.isAuthenticated()) return next();

    res.redirect('/login');
  };
};