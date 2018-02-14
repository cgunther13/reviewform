const path = require('path');

var Models = require('../models/reviews.js');

function postReviewType(req, res) {
  var callback = function(role, type, err) {
    if (err) {
      return res.sendStatus(500);
    } else {
      next(req, res, 'project-details', role, type);
    }
  }
  // Insert review type into the (SELF)REVIEWS database
  Models.insertReviewType(req.session.email, req.body.role, req.body.type, callback);
  // Get review details from the (SELF)REVIEWS database and store the session
  Models.storeReviewSession(req, req.body.role, req.body.type);
}

function postProjectDetails(req, res) {
  var callback = function(type, role, err) {
    if (err) {
      return res.sendStatus(500);
    } else {
      next(req, res, 'overall', type, role);
    }
  }
  if(req.session.type == "Reviewee (Self-Evaluation)") {
    Models.insertProjectDetails(req.session.role, req.session.type, req.body.reviewee_name, req.body.project_code, callback);
  } else {
    Models.insertProjectDetails(req.session.role, req.session.type, req.body.reviewee_name, req.body.reviewer_name, req.body.project_code, req.body.project_start, req.body.project_end, req.body.review_date, req.body.team, req.body.composition, callback);
  }
}

function next(req, res, page, role, type) {
  res.render(page, { role: role, type: type });
}


module.exports = {
  postReviewType: postReviewType,
  postProjectDetails: postProjectDetails
}
