INSERT INTO share_table(user_id, loop_id) 
VALUES(${user_id}, ${loop_id}) RETURNING loop_id;