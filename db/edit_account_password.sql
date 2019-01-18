UPDATE user_account 
SET email=${email}, 
    hash=${hash}, 
    profile_pic=${profile_pic}, 
    username=${username}, 
    name=${name} 
WHERE user_id=${user_id}
RETURNING user_id, email, profile_pic, username, name;
