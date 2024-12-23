-- name: getAllUsers
SELECT
  u.id AS id,
  u.username,
  u.name,
  u.email,
  COALESCE(GROUP_CONCAT (r.name), '') AS roles
FROM
  user u
  LEFT JOIN user_role ur ON u.id = ur.user_id
  LEFT JOIN role r ON ur.role_id = r.id
GROUP BY
  u.id,
  u.username,
  u.name;

-- name: createUser
INSERT INTO user (id, username, name, email, password)
VALUES (?, ?, ?, ?, ?);

-- name: getUserByUsername
SELECT * FROM user WHERE username = ?;

-- name: getUserById
SELECT
  u.id AS id,
  u.username,
  u.name,
  u.email,
  COALESCE(GROUP_CONCAT (r.name), '') AS roles
FROM
  user u
  LEFT JOIN user_role ur ON u.id = ur.user_id
  LEFT JOIN role r ON ur.role_id = r.id
WHERE
  u.id = ?
GROUP BY
  u.id,
  u.username,
  u.name;
