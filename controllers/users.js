const path = require('path');

var usersModels = require('../models/users.js');

function loginUser(req, res) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // Validate the inputs
  if (req.body.email == "" || req.body.email.length > 50) {
    res.render('login', { error: "Email must be between 1 and 50 characters" });
    return;
  } else if (!re.test(req.body.email)) {
    res.render('login', { error: "Please enter a valid email" });
    return;
  } else if (req.body.password == "" || req.body.password.length > 50) {
    res.render('login', { error: "Password must be between 1 and 50 characters" });
    return;
  }

  // Check if user entered a valid email and the correct password
  usersModels.authenticate(req.body.email, req.body.password,
    function(err, success) {
    if (success) {
      // Get user info from the USERS database and store the session
      usersModels.storeSession(req, req.body.email, req.body.password);
      res.redirect('/');
    } else {
      // Password is incorrect
      res.render('login', { error: "Username or password is incorrect"});
    }
  });
}

function logoutUser(req, res) {
  var callback = function(err) {
    if (err) {
      return res.sendStatus(500);
    } else {
      res.redirect('/login');
    }
  }
  req.session.destroy(callback);
}

function isLoggedIn(req, callback) {
  return (req.session.email != null & req.session.password != null);
}


module.exports = {
  loginUser: loginUser,
  logoutUser: logoutUser,
  isLoggedIn: isLoggedIn
}
