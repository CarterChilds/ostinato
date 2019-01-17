INSERT INTO user_account (email, hash, profile_pic, username, name)
VALUES
(${email}, ${hash}, ${profile_pic}, ${username}, ${name})
RETURNING *;