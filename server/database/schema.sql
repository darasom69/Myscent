-- TABLE: USER
CREATE TABLE user (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- TABLE: PERFUME
CREATE TABLE perfume (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    release_year YEAR,
    olfactory_family VARCHAR(100),
    gender ENUM('masculine', 'feminine', 'unisex'),
    top_notes TEXT,
    heart_notes TEXT,
    base_notes TEXT,
    image_url VARCHAR(255)
);

-- TABLE: REVIEW
CREATE TABLE review (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    rating TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    review_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id INT UNSIGNED NOT NULL,
    perfume_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (perfume_id) REFERENCES perfume(id)
);

-- TABLE: USER_COLLECTION
CREATE TABLE user_collection (
    user_id INT UNSIGNED NOT NULL,
    perfume_id INT UNSIGNED NOT NULL,
    status ENUM('owned', 'tested', 'wishlist') NOT NULL,
    added_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, perfume_id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (perfume_id) REFERENCES perfume(id)
);
