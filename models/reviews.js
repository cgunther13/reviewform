const pg = require('pg');
const connString = process.env.DATABASE_URL || 'postgres://localhost/reviews';

// Connect to the postgres database
const client = new pg.Client(connString);
client.connect((err) => {
  if (err) {
    return;
  }
});

function insertReviewType(type, role, callback){
  if (type == "Reviewee (Self-Evaluation)") {
    client.query("INSERT INTO SELFREVIEWS(role) VALUES($1)", [role], (callback));
  } else {
    client.query("INSERT INTO REVIEWS(role) VALUES($1)", [role], (callback));
  }
}

function insertProjectDetails(type, role, reviewee_name, reviewer_name, project_code, project_start, project_end, review_date, team, composition, callback){
  if (type == "Reviewee (Self-Evaluation)") {
    client.query("INSERT INTO SELFREVIEWS(reviewee_name, project_code) VALUES($1, $2)", [reviewee_name, project_code], (callback));
  } else {
    client.query("INSERT INTO REVIEWS(reviewee_name, reviewer_name, project_code, project_start, project_end, review_date, team, composition) VALUES($1, $2, $3, $4, $5, $6, $7, $8)", [reviewee_name, reviewer_name, project_code, project_start, project_end, review_date, team, composition], (callback));
  }
}

module.exports = {
  insertReviewType: insertReviewType,
  insertProjectDetails: insertProjectDetails
}
