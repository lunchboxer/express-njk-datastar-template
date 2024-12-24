-- name: getAllUsers
SELECT id, username, name, email, role FROM user;

-- name: countUsers
SELECT COUNT(1) FROM user;

-- name: createUser
INSERT INTO user (id, username, name, email, password, role)
VALUES (?, ?, ?, ?, ?, ?);

-- name: getUserByUsername
SELECT * FROM user WHERE username = ?;

-- name: usernameExists
SELECT EXISTS (SELECT 1 FROM user WHERE username = ?);

-- name: getUserById
SELECT id, username, name, email, role FROM user WHERE id = ?;
