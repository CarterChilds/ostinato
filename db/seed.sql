DROP TABLE IF EXISTS share_table;
DROP TABLE IF EXISTS loop;
DROP TABLE IF EXISTS user_account;

-- CREATE TABLES
CREATE TABLE user_account (
	user_id SERIAL PRIMARY KEY,
	email VARCHAR(80),
	name VARCHAR(80),
	username VARCHAR(80),
	hash TEXT,
	profile_pic TEXT
);

CREATE TABLE loop (
	loop_id SERIAL PRIMARY KEY,
	creator_id INTEGER REFERENCES user_account(user_id),
	title VARCHAR(80),
	tempo INTEGER,
	instrument VARCHAR(30),
	key VARCHAR(3),
	row_1 VARCHAR(16),
	row_2 VARCHAR(16),
	row_3 VARCHAR(16),
	row_4 VARCHAR(16),
	row_5 VARCHAR(16),
	row_6 VARCHAR(16),
	row_7 VARCHAR(16),
	row_8 VARCHAR(16)
);

CREATE TABLE share_table (
	user_id INTEGER REFERENCES user_account(user_id),
	loop_id INTEGER REFERENCES loop(loop_id)
);

-- DUMMY DATA
INSERT INTO user_account (email, hash, profile_pic)
VALUES ('test@email.com', 'password', 'https://robohash.org/jon');

INSERT INTO loop (title, tempo, key, row_1, row_2, row_3, row_4, row_5, row_6, row_7, row_8)
VALUES ('Big Beat', 150, 'am', '0000111100001111', '1111000011110000', '0000111100001111', '1111000011110000', '0000111100001111', '1111000011110000', '0000111100001111', '1111000011110000'), 
('Droning Bass', 100, 'C', '1100000000000000', '0011000000000000', '1100110000000000', '0011001100000000', '1100110011000000', '0011001100110000', '1100110011001100', '1111111111111111');

INSERT INTO share_table (user_id, loop_id)
VALUES (1, 1), 
(1, 2);