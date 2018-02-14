const { Pool, Client } = require('pg')
const connectionString = process.env.DATABASE_URL || 'postgres://localhost/reviews';
const client = new Client({
  connectionString: connectionString,
})
client.connect()

function insertReviewType(email, role, type, callback){
  if (type == "Reviewee (Self-Evaluation)") {
    const text = 'INSERT INTO SELFREVIEWS (role, reviewee_email) VALUES ($1, $2)'
    const values = [role, email]
    client.query(text, values, (err, res) => {
      if (err) {
        console.log(err.stack)
      } else {
        if (res.rows.length <= 0) {
          callback(role, type, false);
        } else {
          callback("Email not found", true);
        }
      }
    })
  } else {
    client.query("INSERT INTO REVIEWS(role) VALUES($1)", [role], (callback));
  }
}

function storeReviewSession(req, role, type){
  // Retrieve user's information
  var query = client.query("SELECT * FROM USERS WHERE EMAIL = $1 AND PASSWORD = $2", [role, type]);
  if (query) {
    // Set the session
    req.session.role = role;
    req.session.type = type;
  }
}

function insertProjectDetails(role, type, reviewee_name, project_code, callback){
  if (type == "Reviewee (Self-Evaluation)") {
    const text = 'INSERT INTO SELFREVIEWS(reviewee_name, project_code) VALUES($1, $2)'
    const values = [reviewee_name, project_code]
    client.query(text, values, (err, res) => {
      if (err) {
        console.log(err.stack)
      } else {
        if (res.rows.length <= 0) {
          callback(role, type, false);
        } else {
          callback("Email not found", true);
        }
      }
    })
  } else {
    client.query("INSERT INTO REVIEWS(reviewee_name, reviewer_name, project_code, project_start, project_end, review_date, team, composition) VALUES($1, $2, $3, $4, $5, $6, $7, $8)", [reviewee_name, reviewer_name, project_code, project_start, project_end, review_date, team, composition], (callback));
  }
}

// function insertProjectDetails(role, type, reviewee_name, reviewer_name, project_code, project_start, project_end, review_date, team, composition, callback){
//   if (type == "Reviewee (Self-Evaluation)") {
//     console.log("PC:" + project_code)
//     client.query("INSERT INTO SELFREVIEWS(reviewee_name, project_code) VALUES($1, $2)", [reviewee_name, project_code], (callback));
//   } else {
//     client.query("INSERT INTO REVIEWS(reviewee_name, reviewer_name, project_code, project_start, project_end, review_date, team, composition) VALUES($1, $2, $3, $4, $5, $6, $7, $8)", [reviewee_name, reviewer_name, project_code, project_start, project_end, review_date, team, composition], (callback));
//   }
// }

module.exports = {
  insertReviewType: insertReviewType,
  storeReviewSession: storeReviewSession,
  insertProjectDetails: insertProjectDetails
}
