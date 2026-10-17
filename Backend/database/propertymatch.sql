CREATE DATABASE IF NOT EXISTS propertymatch
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE propertymatch;

-- Starter schema. JPA also creates/updates the properties table when the app starts.
CREATE TABLE IF NOT EXISTS properties (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description VARCHAR(2000) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address VARCHAR(180) NOT NULL,
  price DECIMAL(14,2) NOT NULL,
  listing_type VARCHAR(20) NOT NULL,
  property_type VARCHAR(30) NOT NULL,
  bedrooms INT DEFAULT 0,
  bathrooms INT DEFAULT 0,
  area_sqft INT DEFAULT 0,
  image_url VARCHAR(500),
  owner_id BIGINT NOT NULL DEFAULT 1,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_properties_status (status),
  INDEX idx_properties_city (city),
  INDEX idx_properties_listing_type (listing_type)
);
