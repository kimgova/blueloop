LOAD DATA LOCAL INFILE './web-app/csv/countriesSubdivisions.csv'
INTO TABLE city
FIELDS TERMINATED BY ';'
OPTIONALLY ENCLOSED BY '\"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(@column1, @column2, @column3)
SET lett_country_code=@column1, name=@column2, country_id=(SELECT co.id FROM country co WHERE co.letter_code=@column1 LIMIT 1);