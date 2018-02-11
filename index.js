'use strict';

const express = require('express')
const bodyParser = require('body-parser');
const pg = require('pg');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const Controllers = require('./controllers/reviews.js');
const Models = require('./models/reviews.js');

const app = express()
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 4000;

const connString = process.env.DATABASE_URL || 'postgres://localhost:4000/reviews';

// Prune old sessions

// Store session
app.use(session({
  store: new pgSession({
    pg : pg,
    conString : connString,
  }),
  secret: process.env.FOO_COOKIE_SECRET || 'chrisfordirector',
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
  res.render('review-type');
});
app.post('/review-type', Controllers.postReviewType);

// app.get('/project-details', (req, res) => {
//   res.render('project-details');
// });
app.post('/project-details', Controllers.postProjectDetails);


app.listen(port, () => console.log('Example app listening on port ' + port +'!'))
