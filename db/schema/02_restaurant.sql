DROP TABLE IF EXISTS restaurants CASCADE;

CREATE TABLE restaurants (
  id SERIAL PRIMARY KEY NOT NULL,
  address VARCHAR(255) NOT NULL,
  phone_number VARCHAR(255) NOT NULL,
  photo_url VARCHAR(255),
  username VARCHAR(255),
  password VARCHAR(255)
);
