SELECT title, key, tempo, loop.loop_id FROM loop
JOIN join_table ON loop.loop_id = join_table.loop_id
WHERE join_table.user_id = ${id};