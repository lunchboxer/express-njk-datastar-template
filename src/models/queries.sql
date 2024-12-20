-- name: getAllUsers
SELECT * FROM user;

-- name: createUser
INSERT INTO user (id, username, name, email, password) 
VALUES (?, ?, ?, ?, ?);

-- name: getUserByUsername
SELECT * FROM user WHERE username = ?;