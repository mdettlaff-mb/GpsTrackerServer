CREATE SEQUENCE GPS_LOCATION_ID_SEQ;

CREATE TABLE GpsLocation (
	id BIGINT NOT NULL PRIMARY KEY,
	latitude REAL NOT NULL,
	longitude REAL NOT NULL,
	time TIMESTAMP NOT NULL UNIQUE,
	accuracy FLOAT NOT NULL,
	altitude REAL NOT NULL,
	bearing FLOAT NOT NULL,
	speed FLOAT NOT NULL
);
