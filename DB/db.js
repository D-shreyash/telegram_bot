const sqlite3 = require("sqlite3").verbose();
const path = require("path");
let sql;

// Use an absolute path for the database file
const dbPath = path.resolve(__dirname, "test.db");

// Connect to DB
const db = new sqlite3.Database(
  dbPath,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) return console.log("ERROR CREATING CONNECTION", err.message);
    console.log("Connected to the SQLite database.");
  }
);

// Create table if not exists
sql = `CREATE TABLE IF NOT EXISTS USER_UUID (USER_ID TEXT PRIMARY KEY ,UUID TEXT);`;
db.run(sql, (err) => {
  if (err) console.log("ERROR CREATING TABLE", err.message);
  else console.log("Table created or already exists.");
});

// Function to insert data into the database
function insertUUID(uuid, userId, callback) {
  userId = String(userId);

  // First, check if the userId is already present
  const checkSql = "SELECT * FROM USER_UUID WHERE USER_ID = ?";
  db.get(checkSql, [userId], (err, row) => {
    if (err) {
      console.log("ERROR CHECKING USER_ID", err.message);
      callback(err);
    } else if (row) {
      // If the userId is found, return the existing row
      console.log("UserID already exists:", row);
      callback(null, row);
    } else {
      // If the userId is not found, generate a new UUID and insert the new data
      uuid = uuidv4();
      const insertSql = "INSERT INTO USER_UUID (UUID, USER_ID) VALUES (?, ?)";
      db.run(insertSql, [uuid, userId], function (err) {
        if (err) {
          console.log("ERROR INSERTING INTO TABLE", err.message);
          callback(err);
        } else {
          console.log("Data inserted successfully");

          // Retrieve and return the inserted data
          const selectSql = "SELECT * FROM USER_UUID WHERE UUID = ?";
          db.get(selectSql, [uuid], (err, row) => {
            if (err) {
              console.log("ERROR FETCHING DATA", err.message);
              callback(err);
            } else {
              console.log("Inserted Data:", row);
              callback(null, row);
            }
          });
        }
      });
    }
  });
}

// Function to get UUID by USER_ID
function getUserIdByUUID(uuid, callback) {
  uuid = String(uuid);

  const sql = `SELECT USER_ID FROM USER_UUID WHERE UUID = ?`;
  db.get(sql, [uuid], (err, row) => {
    if (err) {
      console.log("ERROR FETCHING USER ID", err.message);
      callback(err);
    } else {
      console.log("Fetched userId:", row);
      callback(null, row ? row.USER_ID : null); // Ensure that USER_ID matches the column name in your database.
    }
  });
}

// Export the insertUUID function
module.exports = {
  insertUUID,
  getUserIdByUUID,
};
