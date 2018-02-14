const { Pool, Client } = require('pg')
const connectionString = process.env.DATABASE_URL || 'postgres://localhost/reviews';
const client = new Client({
  connectionString: connectionString,
})
client.connect()


function authenticate(email, password, callback){
  // Retrieve user's password
  const text = 'SELECT PASSWORD FROM USERS WHERE EMAIL = $1'
  const values = [email]
  client.query(text, values, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      if (res.rows.length > 0) {
        // Email found and password returned
        const hash = res.rows[0].password;
        // Return true if password correct; false otherwise
        callback(null, hash==password);
      } else {
        callback("Email not found", false);
      }
    }
  })
}

function storeSession(req, email, password){
  // Retrieve user's information
  var query = client.query("SELECT * FROM USERS WHERE EMAIL = $1 AND PASSWORD ="
    + " $2", [email, password]);
  if (query) {
    // Set the session
    req.session.email = email;
    req.session.password = password;
  }
}


module.exports = {
  authenticate: authenticate,
  storeSession: storeSession
};
