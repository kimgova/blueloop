LOAD DATA LOCAL INFILE './web-app/csv/countryCodes.csv'
INTO TABLE country 
FIELDS TERMINATED BY ';'
OPTIONALLY ENCLOSED BY '\"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(@column1, @column2, @column3, @column4)
SET name=@column1, area_code=@column2, letter_code=@column3,id=@column4;