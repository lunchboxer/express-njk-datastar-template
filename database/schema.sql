CREATE TABLE user (
	id TEXT PRIMARY KEY NOT NULL,
	username TEXT NOT NULL,
	name TEXT,
    email TEXT,
	password TEXT NOT NULL,
	created TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE UNIQUE INDEX user_username_unique ON user (username);
CREATE UNIQUE INDEX user_email_unique ON user (email);

CREATE TABLE role (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE user_role (
  user_id TEXT NOT NULL,
  role_id TEXT NOT NULL,
  PRIMARY KEY(role_id, user_id),
  FOREIGN KEY (user_id) REFERENCES user(id) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (role_id) REFERENCES role(id) ON UPDATE no action ON DELETE cascade
);

