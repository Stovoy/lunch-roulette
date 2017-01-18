CREATE TABLE USER_PROFILE (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  is_admin BOOLEAN NOT NULL,
  x INT NOT NULL,
  y INT NOT NULL,
  avatar VARCHAR(400)
);

CREATE TABLE USER_SESSION (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES USER_PROFILE (id) NOT NULL,
  session CHAR(36) NOT NULL,
  date_created timestamp default current_timestamp
);

CREATE TABLE STATE (
  spun BOOL NOT NULL,
  question VARCHAR(140) NOT NULL
);

INSERT INTO STATE VALUES (FALSE, 'Please enter an icebreaker question.');
