UPDATE loop SET 
title=${title}, 
tempo=${tempo}, 
key=${key}, 
row_1=${row_1}, 
row_2=${row_2}, 
row_3=${row_3}, 
row_4=${row_4}, 
row_5=${row_5}, 
row_6=${row_6}, 
row_7=${row_7}, 
row_8=${row_8} 
WHERE loop_id=${id}
RETURNING loop_id, title, tempo, key, row_1, row_2, row_3, row_4, row_5, row_6, row_7, row_8;