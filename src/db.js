var sqlite3 = require('sqlite3').verbose();

var db = {}
var createUsersTableQuery = `CREATE TABLE IF NOT EXISTS users (
    id integer PRIMARY KEY AUTOINCREMENT,
    username text NOT NULL,
    password text NOT NULL
    CONSTRAINT username UNIQUE
);`
var createTimestampsTableQuery = `CREATE TABLE IF NOT EXISTS timestamps (
    id integer PRIMARY KEY AUTOINCREMENT,
    username integer NOT NULL,
    timestamp datetime DEFAULT CURRENT_TIMESTAMP NOT NULL
);`
var insertUserQuery = `INSERT INTO users(username, password) VALUES (?,?)`
var getUserByNameQuery = `SELECT id, username, password FROM users WHERE username = ?`
var getUserByIdQuery = `SELECT id, username, password FROM users WHERE id = ?`
var insertTimestampQuery = `INSERT INTO timestamps(username) VALUES (?)`
var getLast5TimestampsQuery = `SELECT timestamp FROM timestamps WHERE username = ? ORDER BY timestamp DESC LIMIT 5`

const connect = () => {
    db = new sqlite3.Database('db/users.db',  sqlite3.OPEN_READWRITE, (err) => {
        if (err)
          return console.error(err.message);
    });
}

const close = () => {
    db.close((err) => {
        if (err)
          return console.error(err.message);
    });
}

const createTables = () => {
    db.run(createUsersTableQuery, function(err) {
        if (err)
          return console.log(err.message);
    });

    db.run(createTimestampsTableQuery, function(err) {
        if (err)
          return console.log(err.message);
    });
}

const createUser = (user, done) => {
    db.run(insertUserQuery, [user.username, user.password], function(err) {
        if (err)
          return done(err);
        
        done(null, this.lastID);
    });
}

const getUserByName = (user, done) => {
    db.get(getUserByNameQuery, [user.username], (err, row) => {
        if (err)
          return done(err.message);

        return done(null, row ? {id: row.id, username: row.username, password: row.password} : null);
    });
}

const getUserById = (id, done) => {
    db.get(getUserByIdQuery, [id], (err, row) => {
        if (err)
          return done(null, false);

        return done(null, row ? {id: row.id, username: row.username, password: row.password} : null);
    });
}

const createTimestamp = (user, done) => {
    db.run(insertTimestampQuery, [user.username], function(err) {
        if (err)
          return done(err);
        
        done(null);
    });
}

const getLast5Timestamps = (user, done) => {
    db.all(getLast5TimestampsQuery, [user.username], (err, rows) => {
        if (err)
          return done(err);

        timestamps = [];

        rows.forEach((row) => {
          timestamps.push(row.timestamp);
        });

        done(null, timestamps);
      });
}

module.exports = {
    connect,
    close,
    createTables,
    createUser,
    getUserByName,
    getUserById,
    createTimestamp,
    getLast5Timestamps
}