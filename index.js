'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const usersControllers = require('./controllers/users.js');
const reviewsControllers = require('./controllers/reviews.js');


const app = express();
const host = process.env.IP || '0.0.0.0';
const port = process.env.PORT || 4000;

const connString = process.env.DATABASE_URL || 'postgres://localhost/reviews';

// Store session
app.use(session({
  store: new pgSession({
    pg : pg,
    conString : connString,
  }),
  secret: process.env.FOO_COOKIE_SECRET || 'solitary-leaf',
  resave: false,
  saveUninitialized : false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

// Display HTML and CSS
app.use(express.static(__dirname + '/views'));
app.set('views', 'views');
app.set('view engine', 'ejs');

// Parse req.body
app.use(bodyParser.urlencoded({
   extended: false
}));
app.use(bodyParser.json());

/*
/ Router
*/

app.get('/', (req, res) => {
  if (usersControllers.isLoggedIn(req, res)) {
    res.render('home');
  } else {
    res.render('login');
  }
});


app.get('/login', (req, res) => {
  res.render('login');
});
app.post('/login', usersControllers.loginUser)

app.get('/logout', usersControllers.logoutUser)


// Review Pages
app.get('/review-type', (req, res) => {
  if (usersControllers.isLoggedIn(req, res)) {
    res.render('review-type');
  } else {
    res.render('login');
  }
});
app.post('/review-type', reviewsControllers.postReviewType);

app.get('/project-details', (req, res) => {
  if (usersControllers.isLoggedIn(req, res)) {
    res.render('project-details');
  } else {
    res.render('login');
  }
});
app.post('/project-details', reviewsControllers.postProjectDetails);

// app.get('/problem-solving', (req, res) => {
//   res.render('problem-solving');
// });
// app.post('/problem-solving', reviewsControllers.postProblemSolving);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
