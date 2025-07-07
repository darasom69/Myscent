-- Active: 1749641901975@@127.0.0.1@3306@Myscent
-- TABLE : Users
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user'
);

-- TABLE : Gender
CREATE TABLE IF NOT EXISTS gender (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- TABLE : Brand
CREATE TABLE IF NOT EXISTS brand (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- TABLE : Olfactory Family
CREATE TABLE IF NOT EXISTS olfactory_family (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- TABLE : Perfume
CREATE TABLE IF NOT EXISTS perfume (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand_id INT UNSIGNED,
    release_year SMALLINT,
    main_gender_id INT UNSIGNED NOT NULL,
    perceived_gender_id INT UNSIGNED,
    image_url VARCHAR(255),
    FOREIGN KEY (brand_id) REFERENCES brand(id),
    FOREIGN KEY (main_gender_id) REFERENCES gender(id),
    FOREIGN KEY (perceived_gender_id) REFERENCES gender(id)
);

-- TABLE : Olfactory Note
CREATE TABLE IF NOT EXISTS olfactory_note (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- TABLE : Perfume Notes (many-to-many with note type)
CREATE TABLE IF NOT EXISTS perfume_note (
    perfume_id INT UNSIGNED NOT NULL,
    note_id INT UNSIGNED NOT NULL,
    note_type ENUM('top', 'heart', 'base') NOT NULL,
    PRIMARY KEY (perfume_id, note_id, note_type),
    FOREIGN KEY (perfume_id) REFERENCES perfume(id) ON DELETE CASCADE,
    FOREIGN KEY (note_id) REFERENCES olfactory_note(id) ON DELETE CASCADE
);

-- TABLE : Perfume Families (many-to-many)
CREATE TABLE IF NOT EXISTS perfume_family (
    perfume_id INT UNSIGNED NOT NULL,
    family_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (perfume_id, family_id),
    FOREIGN KEY (perfume_id) REFERENCES perfume(id) ON DELETE CASCADE,
    FOREIGN KEY (family_id) REFERENCES olfactory_family(id) ON DELETE CASCADE
);

-- TABLE : Review
CREATE TABLE IF NOT EXISTS review (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT UNSIGNED NOT NULL,
    perfume_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (perfume_id) REFERENCES perfume(id)
);

-- TABLE : User Collection
CREATE TABLE IF NOT EXISTS user_collection (
    user_id INT UNSIGNED NOT NULL,
    perfume_id INT UNSIGNED NOT NULL,
    status ENUM('owned', 'tested', 'wishlist') NOT NULL,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, perfume_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (perfume_id) REFERENCES perfume(id)
);

-- GENDER
INSERT INTO gender (id, name) VALUES
  (1, 'Feminin'),
  (2, 'Masculin'),
  (3, 'Mixte');

-- BRAND
INSERT INTO brand (id, name, description) VALUES
  (1, 'Maison Francis Kurkdjian', 'Maison de parfumerie de luxe française'),
  (2, 'Dior', 'Haute parfumerie de la maison Dior');

-- OLFACTORY FAMILY
INSERT INTO olfactory_family (id, name) VALUES
  (1, 'Floral'),
  (2, 'Boisé'),
  (3, 'Fruité'),
  (4, 'Ambré'),
  (5, 'Musc'),
  (6, 'Aromatique');

-- OLFACTORY NOTE
INSERT INTO olfactory_note (id, name) VALUES
  (1, 'Bergamote'),
  (2, 'Cèdre'),
  (3, 'Ambre gris'),
  (4, 'Musc blanc'),
  (5, 'Fleur d’oranger');

-- USERS
INSERT INTO users (id, username, email, password, role) VALUES
  (1, 'dara', 'dara@myscent.com', 'dara', 'admin'),
  (2, 'julia', 'julia@example.com', 'julia', 'user');

-- PERFUME
INSERT INTO perfume (id, name, brand_id, release_year, main_gender_id, perceived_gender_id, image_url) VALUES
  (1, 'Baccarat Rouge 540', 1, 2015, 3, 3, 'baccarat.png'),
  (2, 'Sauvage', 2, 2018, 2, 2, 'sauvage.png');

-- PERFUME FAMILY
INSERT INTO perfume_family (perfume_id, family_id) VALUES
  (1, 4),
  (1, 5),
  (2, 2),
  (2, 6);

-- PERFUME NOTE
INSERT INTO perfume_note (perfume_id, note_id, note_type) VALUES
  (1, 1, 'top'),
  (1, 5, 'heart'),
  (1, 3, 'base'),
  (2, 1, 'top'),
  (2, 2, 'heart'),
  (2, 4, 'base');

-- REVIEW
INSERT INTO review (id, rating, comment, review_date, user_id, perfume_id) VALUES
  (1, 5, 'Incroyable tenue et sillage.', NOW(), 2, 1),
  (2, 4, 'Très frais et boisé.', NOW(), 2, 2);

-- USER COLLECTION
INSERT INTO user_collection (user_id, perfume_id, status, added_date) VALUES
  (2, 1, 'wishlist', NOW()),
  (2, 2, 'tested', NOW());
