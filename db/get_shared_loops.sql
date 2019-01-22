SELECT title, username, key, tempo, instrument, loop.loop_id FROM loop
JOIN share_table ON loop.loop_id = share_table.loop_id
JOIN user_account ON creator_id = user_account.user_id
WHERE share_table.user_id = ${id};