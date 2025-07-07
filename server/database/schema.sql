-- Active: 1749641901975@@127.0.0.1@3306@Myscent

-- TABLE: Users
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- TABLE: Gender
CREATE TABLE gender (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE -- 'masculine', 'feminine', 'unisex'
);

--Table : Brand
CREATE TABLE IF NOT EXISTS brand (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- TABLE: Perfume
CREATE TABLE perfume (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    release_year YEAR,
    olfactory_family VARCHAR(100),
    main_gender_id INT UNSIGNED NOT NULL,
    perceived_gender_id INT UNSIGNED DEFAULT NULL,
    image_url VARCHAR(255),
    FOREIGN KEY (main_gender_id) REFERENCES gender(id) ON DELETE RESTRICT,
    FOREIGN KEY (perceived_gender_id) REFERENCES gender(id) ON DELETE SET NULL
);

-- TABLE: Olfactory Note
CREATE TABLE olfactory_note (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- TABLE: Perfume Note (many-to-many with note type)
CREATE TABLE perfume_note (
    perfume_id INT UNSIGNED NOT NULL,
    note_id INT UNSIGNED NOT NULL,
    note_type ENUM('top', 'heart', 'base') NOT NULL,
    PRIMARY KEY (perfume_id, note_id, note_type),
    FOREIGN KEY (perfume_id) REFERENCES perfume(id) ON DELETE CASCADE,
    FOREIGN KEY (note_id) REFERENCES olfactory_note(id) ON DELETE CASCADE
);

-- TABLE: Review
CREATE TABLE review (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    rating TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    review_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id INT UNSIGNED NOT NULL,
    perfume_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (perfume_id) REFERENCES perfume(id) ON DELETE CASCADE
);

-- TABLE: User Collection
CREATE TABLE user_collection (
    user_id INT UNSIGNED NOT NULL,
    perfume_id INT UNSIGNED NOT NULL,
    status ENUM('owned', 'tested', 'wishlist') NOT NULL,
    added_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, perfume_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (perfume_id) REFERENCES perfume(id) ON DELETE CASCADE
);


INSERT INTO "public"."gender" ("id", "name") VALUES ('1', 'Feminin'), ('2', 'Masculin '), ('3', 'Mixte');

INSERT INTO "public"."olfactory_note" ("id", "name") VALUES ('1', 'Notes de Tête'), ('2', 'Notes de Coeur'), ('3', 'Notes de Fond');
