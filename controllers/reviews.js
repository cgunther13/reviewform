const path = require('path');

var Models = require('../models/reviews.js');

function postReviewType(req, res) {
  var callback = function(type, role, err) {
    if (err) {
      return res.sendStatus(500);
    } else {
      next(req, res, 'project-details', req.session.type, req.session.role);
    }
  }

  // Store the session
  req.session.type = req.body.type;
  req.session.role = req.body.role;

  // Insert review type into the REVIEWS database
  Models.insertReviewType(req.session.type, req.session.role, callback);
}

function postProjectDetails(req, res) {
  console.log("1")
  var callback = function(type, role, err) {
    console.log("5")
    if (err) {
      console.log("5.5")
      return res.sendStatus(500);
    } else {
      console.log("6")
      next(req, res, 'overall', req.session.type, req.session.role);
    }
  }
  if(req.body.type == "Reviewee (Self-Evaluation)") {
    console.log("2")
    Models.insertProjectDetails(req.session.type, req.session.role, req.body.reviewee_name, req.body.project_code, callback);
  } else {
    console.log("2")
    Models.insertProjectDetails(req.session.type, req.session.role, req.body.reviewee_name, req.body.reviewer_name, req.body.project_code, req.body.project_start, req.body.project_end, req.body.review_date, req.body.team, req.body.composition, callback);
  }
}

function submit(req, res) {
  var callback = function(err) {
    if (err) {
      return res.sendStatus(500);
    } else {
      res.redirect('/review-type');
    }
  }
  req.session.destroy(callback);
}

function next(req, res, page, type, role) {
  res.render(page, { type: type, role: role });
}

module.exports = {
  postReviewType: postReviewType,
  postProjectDetails: postProjectDetails
}
