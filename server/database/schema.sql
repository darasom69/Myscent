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
    description TEXT,
    image_url VARCHAR(255)
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
    gender_id INT UNSIGNED NOT NULL,
    image_url VARCHAR(255),
    description TEXT,
    FOREIGN KEY (brand_id) REFERENCES brand(id),
    FOREIGN KEY (gender_id) REFERENCES gender(id)
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
INSERT INTO brand (id, name, description, image_url) VALUES
(1, 'Maison Francis Kurkdjian', 'Créateur Maison Francis Kurkdjian a 62 parfums listés dans notre encyclopédie olfactive. Maison Francis Kurkdjian est une nouvelle marque. La plus ancienne création a été lancée en 2009 et la plus récente date de 2025. Le nez qui a signé ce pafum est Francis Kurkdjian.', 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/MFK.png'),
(2, 'Kilian Paris', 'Créateur By Kilian a 102 parfums listés dans notre encyclopédie olfactive. La plus ancienne création a été lancée en 2007 et la plus récente date de 2025. By Kilian les parfums ont été faits avec la collaboration des parfumeurs Calice Becker, Sidonie Lancesseur, Mathieu Nardin, Benoist Lapouza, Alberto Morillas, Fabrice Pellegrin, Honorine Blanc, Dorothée Piot, Pascal Gaurin, Frank Voelkl et Christian Provenzano.', 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Kilian.png'),
(3, 'BDK', 'BDK Parfums Logo Pays: France Activité principale: Fragrances Site de la marque: lien Créateur de parfums de niche Créateur BDK Parfums a 23 parfums listés dans notre encyclopédie olfactive. BDK Parfums est une nouvelle marque. La plus ancienne création a été lancée en 2016 et la plus récente date de 2025. BDK Parfums les parfums ont été faits avec la collaboration des parfumeurs Ralf Schwieger, Anne-Sophie Behaghel, Alexandra Carlin, Julien Rasquinet, Amelie Bourgeois, Anne Flipo, Dominique Ropion, Violaine Collas, Mathilde Bijaoui, Cécile Matton, Camille Leguay, Serge Majoullier, Jordi Fernández, Marie Schnirer, Amélie Bourgeois et Margaux Le Paih Guérin.', 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/bdk.png'),
(4, 'Nishane', 'Créateur Nishane a 49 parfums listés dans notre encyclopédie olfactive. Nishane est une nouvelle marque. La plus ancienne création a été lancée en 2013 et la plus récente date de 2024. Nishane les parfums ont été faits avec la collaboration des parfumeurs Cécile Zarokian, Jorge Lee, Angelos Balamis, Miguel Matos, Olaf Larsen, Julia Rodriguez Pastor, Chris Maurice, Sylvain Cara, Ilias Ermenidis, Dominique Ropion, Christian Provenzano, Lucas Sieuzac, Alberto Morillas, Jean-Louis Sieuzac, Anne Flipo, Carlos Benaïm, Miroslav Petkov et Julien Rasquinet.', 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/nishane.png'),
(5, 'Roja', 'Créateur Roja Dove a 171 parfums listés dans notre encyclopédie olfactive. La plus ancienne création a été lancée en 2005 et la plus récente date de 2025. Roja Dove les parfums ont été faits avec la collaboration des parfumeurs Roja Dove et Antoine Cotton.', 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/roja.png'),
(6, 'Fréderic Malle', 'Créateur Frederic Malle a 51 parfums listés dans notre encyclopédie olfactive. La plus ancienne création a été lancée en 2000 et la plus récente date de 2025. Frederic Malle les parfums ont été faits avec la collaboration des parfumeurs Suzy Le Helley, Jean-Claude Ellena, Dominique Ropion, Bruno Jovanovic, Maurice Roucel, Carlos Benaïm, Olivia Giacobetti, Pierre Bourdon, Edmond Roudnitska, Ralf Schwieger, Edouard Flechier, Michel Roudnitska, Sophia Grojsman, Fanny Bal, Anne Flipo et Julien Rasquinet.', 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Frederic_malle.png')

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
(2, 'Citron'),
(3, 'Mandarine'),
(4, 'Pamplemousse'),
(5, 'Poire'),
(6, 'Poivre rose'),
(7, 'Fleur d’oranger'),
(8, 'Jasmin'),
(9, 'Rose'),
(10, 'Lavande'),
(11, 'Ylang-ylang'),
(12, 'Tubéreuse'),
(13, 'Gardénia'),
(14, 'Iris'),
(15, 'Cèdre'),
(16, 'Santal'),
(17, 'Patchouli'),
(18, 'Ambre gris'),
(19, 'Musc blanc'),
(20, 'Vanille'),
(21, 'Benjoin'),
(22, 'Oud'),
(23, 'Encens'),
(24, 'Vétiver'),
(25, 'Coriandre'),
(26, 'Baies de genièvre'),
(27, 'Noix de muscade'),
(28, 'Rhum'),
(29, 'Cognac'),
(30, 'Fève tonka'),
(31, 'Styrax'),
(32, 'Baume de Tolu'),
(33, 'Safran'),
(34, 'Prune'),
(35, 'Bois de santal'),
(36, 'Bois ambrés'),
(37, 'Tabac'),
(38, 'Aldéhydes'),
(39, 'Muguet'),
(40, 'Magnolia'),
(41, 'Immortelle'),
(42, 'Ambrettolide'),
(43, 'Canelle'),
(44, 'Cassis'),
(45, 'Osmanthus'),
(46, 'Galbanum'),
(47, 'Bois de gaïac'),
(48, 'Bois de chêne'),
(49, 'Clou de girofle'),
(50, 'Estragon');


-- USERS
INSERT INTO users (id, username, email, password, role) VALUES
  (1, 'dara', 'dara@myscent.com', 'dara', 'admin'),
  (2, 'julia', 'julia@example.com', 'julia', 'user');

-- PERFUME
INSERT INTO perfume (id, name, brand_id, release_year, gender_id, image_url, description) VALUES
  (1, 'Baccarat Rouge 540', 1, 2015, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/MFK/baccarat%20rouge%20540.png', 'Magie conjuguée de la Nature et de l’Homme qui transforme la matière brute en un objet plaisir inimitable. Baccarat Rouge 540 scelle la rencontre de deux emblèmes d’excellence. Cette fragrance lumineuse et intense aux tonalités fleuries ambrées et boisées est une véritable signature olfactive graphique et condensée à l’extrême.'),
  (2, 'Absolue pour le matin', 1, 2024, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/MFK/Absolue%20pour%20le%20matin.png', 'La matinée s’étire. Le soleil, avec ses rayons puissants, jaillit à travers les persiennes. Zénith aromatique, Absolue Pour le Matin est une eau de parfum à la fraicheur florale exacerbée. My Very Intimate Perfumes est une collection exclusive de quatre chefs-d''oeuvre olfactifs qui invite à célébrer la rareté, l''émotion pure, et l''histoire personnelle entre un parfumeur et ses créations.'),
  (3, 'Absolue pour le soir', 1, 2010, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/MFK/Absolue%20pour%20le%20soir.png', 'Inspirée par les nuits décadentes du New-York des seventies, Absolue Pour Le Soir est une eau de parfum à la sensualité fauve et ambrée. Un parfum résolument addictif et hypnotique. My Very Intimate Perfumes est une collection exclusive de quatre chefs-d''oeuvre olfactifs qui invite à célébrer la rareté, l''émotion pure, et l''histoire personnelle entre un parfumeur et ses créations.'),
  (4, 'Reflets d''ambre', 1, 2024, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/MFK/Reflets%20dambre.png', 'Une eau de parfum dont jaillissent lumière et sensualité. Reflets d''ambre, un accord légèrement épicé, aux accents de baies roses et de jasmin aérien, se pare d’une note ambrée fauve puissante et résolument sensuelle. My Very Intimate Perfumes est une collection exclusive de quatre chefs-d''oeuvre olfactifs qui invite à célébrer la rareté, l''émotion pure, et l''histoire personnelle entre un parfumeur et ses créations.'),
  (5, 'Le beau parfum', 1, 2024, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/MFK/Le%20beau%20parfum.png', 'Le Beau Parfum est une eau de parfum audacieuse et addictive, inspirée par un chic impertinent des silhouettes élégantes et contemporaines des Parisiennes. Jasmin, Tubéreuse, Ylang-ylang, Le Beau Parfum se déploie telle une brassée de fleurs solaires. Un sillage sophistiqué pour une silhouette olfactive affirmée. My Very Intimate Perfumes est une collection exclusive de quatre chefs-d''oeuvre olfactifs qui invite à célébrer la rareté, l''émotion pure, et l''histoire personnelle entre un parfumeur et ses créations.'),
  (6, 'Kurky', 1, 2025, 1, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/MFK/Kurky.png', 'Kurky, surnom affectueux de Francis Kurkdjian dans sa jeunesse, évoque une insatiable envie de liberté. Une eau de parfum qui incite à voir la vie en couleurs, à rêver et à s’émerveiller à nouveau.​ Dans un nuage onctueux de muscs blancs, très légèrement vanillé, Kurky distille des notes délicieusement régressives, qui rappelle un accord tutti-frutti acidulé, comme échappé d’une boite de friandises. Un parfum étonnant dont le sillage résonne comme un éclat de rire joyeux et spontané, un sourire ou un rayon de soleil : une invitation à réveiller l’enfant qui dort en nous.​ Assez d’émerveillement pour rêver, assez d’insouciance pour les réaliser : Kurky, c’est le parfum des grands qui osent rêver comme les moins grands.​'),
  (7, 'Grand soir', 1, 2016, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/MFK/Grand%20soir.png', 'L''eau de parfum Grand Soir Maison Francis Kurkdjian invite à se parer de ses plus beaux atours et à parfaire son allure. Prélude aux lumières de la ville, le ciel peint des nuances flamboyantes, jusqu’au miel et puis l’ambre, cette couleur captivante. Ambré et boisé, vibrant et envoûtant, Grand Soir est une splendeur aux éclats sensuels. Dès les premiers instants, la profondeur d’un accord ciste labdanum, lavandin et feuilles de cannelier se révèle tandis que la douce chaleur d’un accord ambré vanillé aux accents de benjoin dicte les notes de fond. Tout simplement irrésistible.'),
  (8, 'Oud satin mood', 1, 2015, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/MFK/Oud%20satin.png', 'Librement inspiré par le bois de oud, matière naturelle rare et précieuse, l''eau de parfum OUD satin mood Maison Francis Kurkdjian traduit le désir de faire vivre un monde chatoyant. Le parfum floral ambré boisé évoque l''envie de s''enrouler pour se perdre dans la profondeur de l''instant et suspendre le temps. Transporté par la finesse de l’accord violette, le bois de oud se courbe au contact de l’essence et de l’absolue de rose Damascena avant de s’assouplir au contact d’un accord ambré vanillé onctueux.'),
  (9, 'Extrait Baccarat rouge 540', 1, 2017, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/MFK/ext%20baccarat%20rouge%20540.png', 'Baccarat Rouge 540 extrait de parfum intensifie la puissance et l’éclat des trois souffles qui composent l’Eau de parfum, sans trahir l’alchimie poétique d’origine inspirée de la fabrication du cristal. Né de la maîtrise du parfumeur et de son savoir-faire unique, cet extrait de parfum floral ambré boisé au sillage longue durée est, pour Francis Kurkdjian, un aboutissement ultime.'),
  (10, 'Le fluidity gold', 1, 2019, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/MFK/Le%20fludity%20gold.png', 'Mêmes notes, deux identités. Façonner la matière pour exprimer tout son potentiel et relever le défi de composer deux eaux de parfum singulières avec les mêmes ingrédients : baies de genièvre, noix de muscade, coriandre, muscs, bois ambrés et vanille. Le duo Gentle Fluidity est né dans l’imaginaire du parfumeur et dessine deux silhouettes olfactives distinctes, pour elle ou pour lui.'),
  (11, 'Apom', 1, 2024, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/MFK/Apom.png', 'APOM. Un acronyme poétique et mystérieux. Une eau de parfum charnelle au sillage lumineux et sensuel, rayonnant et généreux. A Part of Me, une part de soi qu’on laisse aux autres car c’est celui qui la porte qui en raconte l’histoire. Celle d’une conversation intime entre le parfum et la peau, là où le parfum prend vie. Florale aromatique ambrée, APOM dévoile une signature immédiatement familière.'),
  (12, 'Extrait Oud satin mood', 1, 2017, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/MFK/ext%20Oud%20satin.png', 'De même que l’eau de parfum évoque les mouvements voluptueux d’une étoffe de satin, cette variation en extrait en accentue les reflets ambrés. OUD satin mood extrait de parfum Maison Francis Kurkdjian met en scène une abondance de roses jouant de sa sensualité pour arrondir les tonalités sombres et animales du bois de oud avant d’enlacer de douceur les fleurs de violette. Parfum ambré boisé envoûtant, l’extrait de parfum OUD satin mood laisse un sillage opulent, telle une étoile filante brillant de mille feux dans le ciel du désert.'),
  (13, 'A la rose', 1, 2014, 1, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/MFK/a%20la%20rose.png', 'L''eau de parfum À la rose est une ode à la féminité, une déclaration d’amour traduite en parfum. Sensuelle et aérienne, la fragrance met en scène deux variétés de roses extraordinaires : la rose Damascena et la rose Centifolia. L''une et l''autre s''enrichissent pour offrir un parfum floral musqué tour à tour subtil et généreux. Chaque flacon de l''eau de parfum À la rose nécessite deux cent cinquante roses Centifolia fraîchement écloses sous forme d’absolue, qui livrent une note de fond très florale aux inflexions miellées douces et charnelles.'),
  (14, '740', 1, 2022, 1, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/MFK/724.png', 'Dans la lumière d’un ciel pur s’élevant au-dessus de la ville se dresse l’élégante silhouette de 724. Le paysage urbain et l’architecture qui entourent Francis Kurkdjian ont insufflé leurs signifiants dans l’esthétique graphique de cette eau de parfum florale musquée. Lumineuse et fusante, confortable et addictive, 724 vous invite à vivre au rythme de la ville.'),
  (15, 'Angels share', 2, 2020, 2, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Killian%20Paris/angels%20share.png', 'Kilian Hennessy voulait exprimer avec Angels'' Share sa mémoire olfactive des fûts de chêne imbibés d’eau-de-vie. Pour retranscrire cette émotion magique, il a utilisé une vraie essence de cognac dans la composition du parfum. Angels’ Share est la représentation olfactive de plus de 250 ans du cognac le plus prestigieux.'),
  (16, 'Apple brandy', 2, 2021, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Killian%20Paris/apple%20brandy.png', 'Cette ouverture pleine de fraîcheur, dévoile la personnalité profonde du parfum : un accord marqué d''eau-de-vie de pomme, dans lequel se glisse un mélange à la fois fruité et craquant qui s''harmonise parfaitement avec le Brandy - mélange recréé à partir de notes de Rhum pour donner un aspect liquoreux, mousseux et aux notes de Vanille.'),
  (17, 'Black phantom', 2, 2017, 2, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Killian%20Paris/black%20phantom.png', 'Le parfum s''ouvre sur un accord de ''Shin Shin'', une boisson enflammée de café fort mélangé au rhum des Caraïbes. L''amertume aromatique du Café est accentuée par la chaleur terreuse du Vétiver de Java.'),
  (18, 'Love don''t by shy ', 2, 2007, 1, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Killian%20Paris/love%20by%20kilian.png', '”Love don’t be shy est le premier parfum que j’ai créé pour KILIAN PARIS. Mon but était de créer un parfum gourmand qui ne ressemblerait à aucun autre sur le marché. Autrement dit, je devais éviter la combinaison classique d’éthyl maltol et de patchouli.”'),
  (19, 'Old fashioned', 2, 2024, 2, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Killian%20Paris/old%20fashioned.png', 'Il s''épanouit en un bouquet sophistiqué bâti autour d''une essence de Cèdre ultraconcentrée et d''Absolu d''Immortelle, avec des notes persistantes de Styrax et de Baume de Tolu qui évoquent le vieillissement enfût et les landes boisées envahies de brume d''Ecosse.'),
  (20, 'Smoking hot', 2, 2023, 2, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Killian%20Paris/smoking%20hot%20.png', 'Smoking Hot s''ouvre sur le fruit défendu : une saveur ronde de narguilé à la pomme se mêle à l''essence chaude d''écorce de cannelle. Des notes de tabac du Kentucky séché par un feu brûlant entrainent une combustion lente.'),
  (21, 'Sunkissed goddess', 2, 2024, 1, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Killian%20Paris/sunkissed.png', 'Sunkissed Goddess s''ouvre sur la douceur du Tiaré blanc et la sensualité de l''Ylang-Ylang, suivi de la rondeur chaleureuse du Coco et de la Vanille, pour finir sur des notes profondes de Gaïac et de Ciste Labdanum, deux signatures emblématiques de Kilian Paris, reconnues pour leur caractère résineux, leur énergie vibrante et leur séduction intemporelle.'),
  (22, 'Vodka on the rocks', 2, 2014, 2, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Killian%20Paris/vodka%20on%20the%20rocks.png', 'La glace craquèle sous un flot de liquide clair et soyeux, éveillant une curiosité profonde de mise en bouche. Associant la fraîcheur d''épices comme la Cardamome et la Coriandre à des Aldéhydes en notes de tête.'),
  (23, 'Ambre safrano', 3, 2022, 2, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/BDK/AmbreSafrano.png', 'Nuage de safran doré mêlé à la fumée ambrée. Parfum intense construit autour d’une dualité cuir noir et vanille. La gourmandise de la prune épouse la force du bois de chêne de France. Flamme de safran soutenue par un ambre sensuel.'),
  (24, 'Bouquet de Hongrie', 3, 2016, 1, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/BDK/BouquetDeHongrie.png', 'Accord floral musqué rappelant les origines austro-hongroises d’Edith Benedek, grande dame ayant participé à la diffusion de parfums prestigieux tout au long du 20ème siècle à Paris. Bouquet floral rappelant l’élégance et le chic absolu de cette femme d’affaire, entre action et romantisme.'),
  (25, 'Gris charnel', 3, 2019, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/BDK/GrisCharnel.png', 'Nuances de gris infini. Au fur et à mesure que le temps passe, la beauté du gris se dévoile sur la peau et dans les rues de Paris. Bois de santal véritable mêlé à des notes de vétiver bourbon adouci par la beauté d’un iris puissant.'),
  (26, 'Gris charnel Extrait ', 3, 2022, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/BDK/GrisCharnelExtrait.png', 'Concentré à 30 %, Gris Charnel Extrait révèle l''intensité de la signature originale pour en extraire une version plus riche et plus facettée. L''essence boisée du patchouli s''invite et apporte de la profondeur au santal et à la fève tonka qui se révèlent plus texturés et chaleureux.'),
  (27, 'Impadia', 3, 2025, 1, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/BDK/IMPADIA.png', 'Une journée d''une splendeur impériale où chaque allure rime avec élégance et majesté. Un sillage boisé, crémeux et addictif qui habille le corps. Absolu de rose précieux accompagné des essences de mandarine et de bergamote sur fond envoûtant de vanille noire.'),
  (28, 'Oud abramad', 3, 2016, 2, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/BDK/OudAbramad.png', 'Véritable essence de Oud majestueux, aux accords d’encens, de safran, de rose et de fleurs blanches. 2 - Parfum mythique de la collection orientale laissant place à un sillage royal. Pouvoir et force, allure puissante. De la plus belle élégance, parfum aux matières premières rares et nobles.'),
  (29, 'Pas ce soir', 3, 2016, 1, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/BDK/PasCeSoir.png', 'Claquement de talons, et courses folles à Concorde, Saint-Germain, ou Montmartre. Une fragrance aux accords de poire maîtresse, d’épices modernes et de fleurs exclusives grâce au développement d’un absolu de jasmin de haute qualité et de chutney de coing'),
  (30, 'Pas ce soir Extrait', 3, 2023, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/BDK/PasCeSoirExtrait.png', 'À l’image de sa signature originale, Pas ce soir Extrait évoque le mystère et la sensualité parisienne. Concentrée à 30%, cette création plus facettée suscite addiction et gourmandise. Le cacao se mêle à la fraîcheur épicée du poivre noir et du gingembre.'),
  (31, 'Tubereuse imperial', 3, 2016, 1, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/BDK/TubereuseImperial.png', 'Accord de fleurs blanches où la tubéreuse solaire domine aux côtés de notes de fond ambrés composées principalement d’iris et d’absolu de jasmin d''Égypte. Eau de parfum aux facettes ambrées florales laissant place à une sensualité certaine, éprise d’une modernité absolue.'),
  (32, 'Villa néroli', 3, 2022, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/BDK/villa.png', 'Ambiance rêveuse et romanesque sur l’île de Capri. L’air est de l’eau, les criques paradisiaques et les falaises abruptes. Sur la peau, Villa Néroli raconte un bain de soleil qui n’en finit pas dans la Villa Malaparte où l’on pourrait presque apercevoir les silhouettes de Jackie Kennedy ou de Brigitte Bardot.'),
  (33, 'Ani', 4, 2019, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Nishane/ANI.png', 'Ani capture le contraste merveilleux des ors et des rouges de la cité de l’an mil. Une ouverture brillante de bergamote et de gingembre bleu graduellement se réchauffe des teintes pastel de la rose et du cassis avant de laisser place à la rondeur de la vanille et des baumes – une évocation chaleureuse des parfums unissant la Turquie et l’Arménie.'),
  (34, 'Deziro', 4, 2024, 2, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Nishane/Dezro.png', 'La fraîcheur des embruns s''ourle d''une menthe aquatique et minérale. Vétiver et papyrus fumés croisent la douceur lactée du santal et la chaleur irrésistible de la badiane qu''allonge une surdose d''Ambrettolide, comme un écho à une peau salée doucement léchée par le soleil.'),
  (35, 'Hacivat', 4, 2017, 2, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Nishane/HACIVAT.png', 'Un hommage au célèbre personnage du théâtre d’ombres turc, Hacivat incarne son élégance, son esprit et sa sophistication. L’ouverture éclatante de pamplemousse saisit sa vivacité, l’ananas son caractère solaire tandis que l’avalanche de bois clairs et modernes, du clearwood au timberwood, achèvent de peindre l’image d’une énergie contemporaine.'),
  (36, 'Hundred silent ways', 4, 2016, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Nishane/HUNDRED-SILENT-WAYS.png', 'Sous un voile irrésistible de vanille et de santal, un bouquet floral unit les facettes crémeuses du gardénia à une tubéreuse narcotique et un cœur d’iris poudré. Pêche juteuse et vétiver fumé tendent la composition, transformant Hundred Silent Ways en un cri d’amour ineffable adressé à qui saurait l’entendre.'),
  (37, 'Nefs', 4, 2019, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Nishane/NEFS.png', 'Une brise qui souffle sur le Bosphore, enrichie des parfums millénaires qui tissent le lien entre Europe et Asie, Nefs est une composition assumant l’opulence à l’extrême. Oud et cèdre de l’orient proche et lointain croisent le lait, le beurre et le sucre des gourmandises stambouliotes. La figue le miel et la vanille adoucissent le fumé d’un accord de cuir et de bois de gaïac tandis que la rose et l’osmanthus romantisent l’épicé de la cannelle, de la muscade et du safran – luxe impérial et impérieux.'),
  (38, 'Shinanay', 4, 2024, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Nishane/SHINANAY.png', 'Deuxième opus de la collection Experimental, Shinanay est un hymne à la joie multicolore, où fleurs anciennes et clairs aldéhydes se parent des teintes les plus chaudes de la palette du parfumeur. Ourlé de baumes et de résines caramélisés, un cœur narcotique de tubéreuse, de magnolia et de gardénia pulse contre la verticalité verte du galbanum et du muguet.'),
  (39, 'Tuberoza', 4, 2014, 1, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Nishane/TUBEROZA.png', 'Un soir à l’opéra. Varsovie s’enchante. Le velours des fauteuils rougit à la lueur des dorures et du cadre de scène. Un parfum enivre l’audience. Une tubéreuse décomplexée et opulente. Tuberoza saisit l’essence de ce moment dérobé au quotidien : la tubéreuse, absolue, s’enrichit des textures de l’ylang-ylang solaire, du vert souci, et du jasmin sambac au fruité entêtant – le drame, le rouge, le faste.'),
  (40, 'Amber aoud', 5, 2012, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Roja/amber-aoud.png', 'Apprécié dans le monde entier, Amber Aoud séduit par son charme. Son mélange classique de rose, de safran et d''oud sublime la perfection olfactive, tandis que la douceur du benjoin et de la figue contraste avec la saveur salée de l''ambre gris. Tel un éclair capté dans un flacon, la beauté d''Amber Aoud réside dans son équilibre : une symphonie de notes sucrées, épicées, salées et boisées vous enveloppe dans une expérience envoûtante, baptisée « L''Effet Amber Aoud ».'),
  (41, 'Aoud extraordinaire', 5, 2024, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Roja/aoud-extraordinaire.png', 'Un cocktail éclatant de fruits tropicaux et de fleurs rafraîchissantes crée un éclat qui illumine n''importe quelle pièce. Pour une présence et une estime affirmées, un lit de cachemire et de délicieuses notes gourmandes évoquent le plaisir d''une vie bien remplie. Procurant à celui qui le porte la sensation d''être baigné d''or, Aoud Extraordinaire est une nouveauté si inattendue qu''elle en devient extraordinaire. Un luxe accessible à tous.'),
  (42, 'Apex eau intense', 5, 2025, 2, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Roja/apex-eau-intense.png', 'Célébrant les merveilles naturelles du monde et tous ceux qui l''explorent, APEX est un accord chypré frais et fruité aux nuances spirituelles et sensuelles. Une explosion d''agrumes acidulés ouvre l''expérience APEX sur une bouffée d''air frais, tandis que la sensation ensoleillée de mandarine et d''ananas juteux mène la danse, favorisant un état d''esprit positif et nous inspirant à atteindre nos objectifs. '),
  (43, 'Danger pour femme', 5, 2021, 1, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Roja/danger-pour-femme.png', 'Dangereux non pas pour la femme qui le porte, mais pour ceux qui le sentent, ce parfum devrait vous alerter ! Tentatrice rouge rubis au pouvoir de contrôler chacun de vos mouvements, la Rose de Mai vous invite à respirer avec fraîcheur et enthousiasme. Mais attention, les aphrodisiaques vous mettent au défi d''inspirer plus profondément. '),
  (44, 'Danger pour homme', 5, 2011, 2, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Roja/danger-pour-homme.png', 'Cette création ne cache pas sa séduction : elle l''affirme sans s''en excuser. Une puissante dose aromatique de lavande et d''estragon, accompagnée d''une pincée de clou de girofle et de cumin épicés pour un regain de vigueur, annonce Danger comme un parfum captivant.'),
  (45, 'Elysieum pour femme', 5, 2024, 1, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Roja/elysium-pour-femme.png', 'Dotée d''un esprit fort et indépendant, notre héroïne trace son propre chemin à travers un paysage fantastique. Réveillées par son toucher, les fleurs s''épanouissent de leur plus belle et parfumée manière, projetant un kaléidoscope de couleurs à l''horizon. Parfum doux et rafraîchissant, imprégné d''une abondance de bienfaits de la nature.'),
  (46, 'Elysium pour homme', 5, 2017, 2, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Roja/elysium-pour-homme.png', 'Élysée – rares sont ceux qui ont la capacité de réaliser ce rêve. Seuls les héros et les vertueux sont destinés à atteindre la vie qu''ils désirent. C''est pourquoi chaque ingrédient de ce parfum a été choisi pour imiter cette rare force de caractère. Les légendes de la parfumerie se mêlent dans cet élixir de pure vaillance – un parfum créé pour l''homme qui n''a besoin d''aucune aide pour atteindre son Élysée, son paradis.'),
(47, 'Manhattan', 5, 2022, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Roja/manhattan.png', 'Manhattan est un accord puissant et audacieux : à la fois dur et doux, le bois de cèdre sec et le tabac fumé contrastent avec la douceur enveloppante de la vanille et de la noix de coco, personnifiant la nature contrastée de la vie urbaine.'),
(48, 'Scandal pour femme', 5, 2021, 1, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Roja/scandal-pour-femme.png', 'Un scandale éclate dans un hôtel cinq étoiles. Derrière des rideaux de lin blanc, des murmures s''échangent. Les clients ne peuvent s''empêcher de contempler une silhouette fabuleuse, drapée de diamants et dissimulée derrière des lunettes de soleil. Perchée nonchalamment sur son balcon, elle sait que tous les regards sont braqués sur elle. Bien qu''elle garde ses cartes secrètes, on dirait presque qu''elle veut être vue.'),
(49, 'Scandale pour homme', 5, 2019, 2, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Roja/scandal-pour-homme.png', 'Parfum classique inspiré du salon de coiffure, conçu pour l''homme moderne et sophistiqué, Scandal revisite la structure emblématique de la Fougère, le style le plus frais de la parfumerie masculine. Une explosion d''agrumes vibrante, composée de citron, de bergamote et de petit-grain, est sublimée par une note fruitée et acidulée de rhubarbe, tandis que les vertus vivifiantes des herbes charment les sens.'),
(50, 'Sweetie aoud', 5, 2015, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Roja/sweetie-aoud.png', 'Entrez dans un monde de gourmandise, Sweetie Aoud vous téléporte dans un grand palais arabe. Dans la cuisine royale, un chef pâtissier français fait flotter dans l''air l''odeur du beurre fondu, du sucre caramélisé et de l''amande grillée avec le parfum du bois d''agar et de l''encens brûlant des Bakhoors.'),
(51, 'United arab emirates', 5, 2017, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Roja/united-arab-emirates.png', 'L''encens fumé et le poivre rose chaleureux créent le décor d''une métropole moderne et animée. Fuyant la chaleur de la ville, vous vous élevez vers les cieux pour assister à une somptueuse fête sur un toit. Une note fraîche de rose apporte une bouffée d''air frais, un soulagement de la brume de la rue.'),
(52, 'Acne studio', 6, 2024, 1, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Frederic%20Malle/acne%20studio.png', 'C''est un style. Un état d''esprit, mis en bouteille par la jeune prodige Suzy le Helley. Pour Frédéric Malle, elle a traduit en odeurs l''équation de la marque de mode suédoise, savant mélange de minimalisme et d''audace, de cool et de chic.'),
(53, 'Dans tes bras', 6, 2008, 3, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Frederic%20Malle/Dans%20tes%20bras.png', 'C''est l''émotion d''une étreinte. L''alchimie de l''instant magique où deux corps se rapprochent. Maître dans l''expression olfactive de la sensualité, Maurice Roucel orchestre un coup de foudre inoubliable entre le Cashméran, note boisée à la vibration chaude et veloutée, et la délicatesse d''une violette aux accents poudrés.'),
(54, 'En passant', 6, 2000, 1, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Frederic%20Malle/en%20passant.png', 'Paris, un matin radieux de mai. Au détour d''une ruelle, un courant d''air transporte les effluves d''un lilas. Cette fleur dite « muette », dont il n''existe aucune essence naturelle, est ici recréée par Olivia Giacobetti avec un réalisme saisissant.'),
(55, 'Hope', 6, 2024, 2, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Frederic%20Malle/hope.png', 'On dit de lui qu''il est le pilier du monde. D''autres chuchotent qu''il fait vivre. Depuis toujours, l''espoir fait battre le cœur de l''humanité. Troisième chef-d''œuvre du parfumeur Dominique Ropion pour la collection Desert Gems, HOPE est un parfum ambré et boisé qui met en lumière la noblesse absolue d''une essence exceptionnelle de oud.'),
(56, 'Musc ravageur', 6, 2000, 2, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Frederic%20Malle/musc%20ravageur.png', 'Chaud devant : cet accord ambré signé par un maître du genre, Maurice Roucel, dégage un érotisme implacable. Bergamote et mandarine offrent une entrée en matière lumineuse à sa formule dépourvue de fleurs, comme pour mieux laisser la place à son fond ambré, musqué, sexy en diable, qui conjugue l''attraction de la vanille, la texture onctueuse du bois de santal et la tentation des muscs. Une séduction franche, assumée, sans détours.'),
(57, 'Portrait of lady', 6, 2010, 1, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Frederic%20Malle/portrait%20of%20a%20lady.png', 'À travers cette rose démesurée, magnifiée par les bois, l''ambre et l''encens, les créateurs redessinent les contours des chypres, une famille olfactive synonyme des grandes heures de la parfumerie du XXème siècle.'),
(58, 'Promise', 6, 2017, 2, 'https://jfeooadyoonrolsnshme.supabase.co/storage/v1/object/public/image/Frederic%20Malle/promise.png', 'Emblème de la culture moyen-orientale, l''oud est un trésor de la nature. Un « or noir » dont la senteur profonde et facettée fascine le maître parfumeur Dominique Ropion. Avec PROMISE, il en recrée toute la noblesse grâce au cypriol, une plante originaire d''Inde, qu''accompagnent de précieuses essences de roses turque et bulgare.');

-- PERFUME FAMILY
-- Maison Francis Kurkdjian
INSERT INTO perfume_family (perfume_id, family_id) VALUES
(1, 1), (1, 2), (1, 4),   -- Baccarat Rouge 540 : floral, boisé, ambré
(2, 1), (2, 6),           -- Absolue pour le matin : floral, aromatique
(3, 4), (3, 2),           -- Absolue pour le soir : ambré, boisé
(4, 4), (4, 1),           -- Reflets d'ambre : ambré, floral
(5, 1),                   -- Le beau parfum : floral solaire
(6, 3), (6, 5),           -- Kurky : fruité, musqué
(7, 4), (7, 2),           -- Grand soir : ambré, boisé
(8, 4), (8, 1), (8, 2),   -- Oud satin mood : ambré, floral, boisé
(9, 4), (9, 2),           -- Extrait Baccarat : ambré, boisé
(10, 4), (10, 5),         -- Le Fluidity Gold : ambré, musqué
(11, 1), (11, 4), (11, 6),-- Apom : floral, ambré, aromatique
(12, 4), (12, 2),         -- Extrait Oud satin mood : ambré, boisé
(13, 1),                  -- A la rose : floral
(14, 1), (14, 5),         -- 724 : floral, musqué
-- Kilian Paris
(15, 4), (15, 2),         -- Angels Share : ambré, boisé
(16, 3), (16, 4),         -- Apple brandy : fruité, ambré
(17, 2), (17, 4),         -- Black phantom : boisé, ambré
(18, 1), (18, 3),         -- Love don’t be shy : floral, fruité
(19, 2), (19, 4),         -- Old fashioned : boisé, ambré
(20, 2), (20, 4),         -- Smoking hot : boisé, ambré
(21, 1), (21, 4),         -- Sunkissed goddess : floral, ambré
(22, 6), (22, 2),         -- Vodka on the rocks : aromatique, boisé
-- BDK Parfums
(23, 4), (23, 2),         -- Ambre safrano : ambré, boisé
(24, 1),                  -- Bouquet de Hongrie : floral
(25, 2), (25, 1),         -- Gris charnel : boisé, floral
(26, 2), (26, 1),         -- Gris charnel extrait : boisé, floral
(27, 2), (27, 1),         -- Impadia : boisé, floral
(28, 2), (28, 4),         -- Oud abramad : boisé, ambré
(29, 1), (29, 3),         -- Pas ce soir : floral, fruité
(30, 1), (30, 4),         -- Pas ce soir extrait : floral, ambré
(31, 1), (31, 4),         -- Tubereuse imperial : floral, ambré
(32, 1),                  -- Villa néroli : floral
-- Nishane
(33, 1), (33, 4),         -- Ani : floral, ambré
(34, 2), (34, 4),         -- Deziro : boisé, ambré
(35, 2),                  -- Hacivat : boisé
(36, 1), (36, 5),         -- Hundred silent ways : floral, musqué
(37, 4), (37, 2),         -- Nefs : ambré, boisé
(38, 1), (38, 4),         -- Shinanay : floral, ambré
(39, 1),                  -- Tuberoza : floral
-- Roja
(40, 4), (40, 2), (40, 1),-- Amber aoud : ambré, boisé, floral
(41, 4), (41, 3),         -- Aoud extraordinaire : ambré, fruité
(42, 4), (42, 3),         -- Apex eau intense : ambré, fruité
(43, 1), (43, 4),         -- Danger femme : floral, ambré
(44, 2), (44, 4),         -- Danger homme : boisé, ambré
(45, 1),                  -- Elysium femme : floral
(46, 2),                  -- Elysium homme : boisé
(47, 2), (47, 4),         -- Manhattan : boisé, ambré
(48, 1),                  -- Scandal femme : floral
(49, 2), (49, 6),         -- Scandale homme : boisé, aromatique
(50, 3), (50, 4),         -- Sweetie aoud : fruité, ambré
(51, 2), (51, 4),         -- United Arab Emirates : boisé, ambré
-- Frédéric Malle
(52, 1), (52, 6),         -- Acne studio : floral, aromatique
(53, 4), (53, 2), (53, 1),-- Dans tes bras : ambré, boisé, floral
(54, 1),                  -- En passant : floral
(55, 4), (55, 2),         -- Hope : ambré, boisé
(56, 4), (56, 2), (56, 5),-- Musc ravageur : ambré, boisé, musqué
(57, 1), (57, 4),         -- Portrait of lady : floral, ambré
(58, 4), (58, 2);         -- Promise : ambré, boisé

-- PERFUME NOTE
INSERT INTO perfume_note (perfume_id, note_id, note_type) VALUES
-- MFK
(1, 1, 'top'),   -- Bergamote
(1, 6, 'top'),   -- Poivre rose
(1, 8, 'heart'), -- Jasmin
(1, 9, 'heart'), -- Rose
(1, 18, 'base'), -- Ambre gris
(1, 22, 'base'), -- Oud
(1, 19, 'base'), -- Musc blanc
(2, 1, 'top'),   -- Bergamote
(2, 3, 'top'),   -- Mandarine
(2, 8, 'heart'), -- Jasmin
(2, 7, 'heart'), -- Fleur d’oranger
(2, 16, 'base'), -- Santal
(2, 19, 'base'), -- Musc blanc
(3, 6, 'top'),   -- Poivre rose
(3, 9, 'heart'), -- Rose
(3, 23, 'base'), -- Encens
(3, 18, 'base'), -- Ambre gris
(3, 22, 'base'), -- Oud
(4, 5, 'top'),   -- Poire
(4, 6, 'top'),   -- Poivre rose
(4, 8, 'heart'), -- Jasmin
(4, 18, 'base'), -- Ambre gris
(4, 19, 'base'), -- Musc blanc
(5, 7, 'top'),   -- Fleur d’oranger
(5, 8, 'heart'), -- Jasmin
(5, 11, 'heart'),-- Ylang-ylang
(5, 12, 'heart'),-- Tubéreuse
(5, 16, 'base'), -- Santal
(6, 5, 'top'),   -- Poire
(6, 3, 'top'),   -- Mandarine
(6, 20, 'heart'),-- Vanille
(6, 19, 'base'), -- Musc blanc
(7, 18, 'heart'),-- Ambre gris
(7, 21, 'base'), -- Benjoin
(7, 16, 'base'), -- Santal
(7, 17, 'base'), -- Patchouli
(8, 9, 'heart'), -- Rose
(8, 8, 'heart'), -- Jasmin
(8, 22, 'base'), -- Oud
(8, 19, 'base'), -- Musc blanc
(8, 18, 'base'), -- Ambre gris
(9, 1, 'top'),   -- Bergamote
(9, 6, 'top'),   -- Poivre rose
(9, 8, 'heart'), -- Jasmin
(9, 9, 'heart'), -- Rose
(9, 18, 'base'), -- Ambre gris
(9, 22, 'base'), -- Oud
(9, 19, 'base'), -- Musc blanc
(10, 26, 'top'), -- Baies de genièvre
(10, 27, 'top'), -- Noix de muscade
(10, 25, 'top'), -- Coriandre
(10, 36, 'heart'), -- Bois ambrés
(10, 20, 'base'), -- Vanille
(10, 19, 'base'), -- Musc blanc
(11, 8, 'heart'), -- Jasmin
(11, 7, 'heart'), -- Fleur d’oranger
(11, 18, 'base'), -- Ambre gris
(11, 19, 'base'), -- Musc blanc
(12, 9, 'heart'), -- Rose
(12, 8, 'heart'), -- Jasmin
(12, 22, 'base'), -- Oud
(12, 19, 'base'), -- Musc blanc
(12, 18, 'base'), -- Ambre gris
(13, 9, 'heart'), -- Rose
(13, 8, 'heart'), -- Jasmin
(13, 14, 'heart'),-- Iris
(13, 19, 'base'), -- Musc blanc
(14, 1, 'top'),   -- Bergamote
(14, 9, 'heart'), -- Rose
(14, 8, 'heart'), -- Jasmin
(14, 19, 'base'), -- Musc blanc
-- Kilian
(15, 29, 'top'),  -- Cognac
(15, 43, 'heart'),-- Cannelle
(15, 21, 'base'), -- Benjoin
(15, 20, 'base'), -- Vanille
(16, 3, 'top'),   -- Mandarine
(16, 5, 'top'),   -- Poire
(16, 28, 'heart'),-- Rhum
(16, 20, 'base'), -- Vanille
(16, 18, 'base'), -- Ambre gris
(17, 28, 'top'),  -- Rhum
(17, 37, 'heart'),-- Tabac
(17, 24, 'base'), -- Vétiver
(17, 16, 'base'), -- Santal
(18, 7, 'top'),   -- Fleur d’oranger
(18, 8, 'heart'), -- Jasmin
(18, 11, 'heart'),-- Ylang-ylang
(18, 20, 'base'), -- Vanille
(19, 15, 'heart'),-- Cèdre
(19, 41, 'heart'),-- Immortelle
(19, 31, 'base'), -- Styrax
(19, 32, 'base'), -- Baume de Tolu
(20, 5, 'top'),   -- Poire
(20, 43, 'heart'),-- Cannelle
(20, 37, 'base'), -- Tabac
(21, 7, 'top'),   -- Fleur d’oranger
(21, 11, 'heart'),-- Ylang-ylang
(21, 20, 'base'), -- Vanille
(21, 16, 'base'), -- Santal
(22, 38, 'top'),  -- Aldéhydes
(22, 25, 'heart'),-- Coriandre
(22, 26, 'heart'),-- Baies de genièvre
(22, 15, 'base'), -- Cèdre
-- BDK Parfums
(23, 33, 'top'),  -- Safran
(23, 34, 'heart'),-- Prune
(23, 48, 'base'), -- Bois de chêne
(23, 18, 'base'), -- Ambre gris
(23, 19, 'base'), -- Musc blanc
(24, 8, 'heart'), -- Jasmin
(24, 9, 'heart'), -- Rose
(24, 14, 'heart'),-- Iris
(24, 19, 'base'), -- Musc blanc
(25, 35, 'heart'),-- Bois de santal
(25, 24, 'heart'),-- Vétiver
(25, 14, 'base'), -- Iris
(25, 19, 'base'), -- Musc blanc
(26, 17, 'heart'),-- Patchouli
(26, 35, 'heart'),-- Bois de santal
(26, 30, 'base'), -- Fève tonka
(26, 19, 'base'), -- Musc blanc
(27, 9, 'heart'), -- Rose
(27, 3, 'top'),   -- Mandarine
(27, 1, 'top'),   -- Bergamote
(27, 20, 'base'), -- Vanille
(28, 22, 'base'), -- Oud
(28, 23, 'base'), -- Encens
(28, 33, 'top'),  -- Safran
(28, 9, 'heart'), -- Rose
(28, 8, 'heart'), -- Jasmin
(29, 5, 'top'),   -- Poire
(29, 8, 'heart'), -- Jasmin
(29, 3, 'top'),   -- Mandarine
(30, 8, 'heart'), -- Jasmin
(30, 43, 'top'),  -- Canelle
(30, 18, 'base'), -- Ambre gris
(30, 37, 'base'), -- Tabac
(31, 12, 'heart'),-- Tubéreuse
(31, 8, 'heart'), -- Jasmin
(31, 14, 'heart'),-- Iris
(31, 18, 'base'), -- Ambre gris
(32, 7, 'top'),   -- Fleur d’oranger
(32, 8, 'heart'), -- Jasmin
(32, 19, 'base'), -- Musc blanc
-- Nishane
(33, 1, 'top'),   -- Bergamote
(33, 43, 'top'),  -- Canelle
(33, 9, 'heart'), -- Rose
(33, 44, 'heart'),-- Cassis
(33, 20, 'base'), -- Vanille
(34, 24, 'top'),  -- Vétiver
(34, 15, 'heart'),-- Cèdre
(34, 16, 'heart'),-- Santal
(34, 42, 'base'), -- Ambrettolide
(35, 4, 'top'),   -- Pamplemousse
(35, 5, 'top'),   -- Poire
(35, 15, 'heart'),-- Cèdre
(36, 13, 'heart'),-- Gardénia
(36, 12, 'heart'),-- Tubéreuse
(36, 14, 'heart'),-- Iris
(36, 20, 'base'), -- Vanille
(37, 22, 'base'), -- Oud
(37, 45, 'heart'),-- Osmanthus
(37, 43, 'top'),  -- Canelle
(37, 33, 'top'),  -- Safran
(37, 18, 'base'), -- Ambre gris
(38, 12, 'heart'),-- Tubéreuse
(38, 40, 'heart'),-- Magnolia
(38, 13, 'heart'),-- Gardénia
(38, 46, 'top'),  -- Galbanum
(38, 39, 'heart'),-- Muguet
(39, 12, 'heart'),-- Tubéreuse
(39, 11, 'heart'),-- Ylang-ylang
(39, 8, 'heart'), -- Jasmin
-- Roja Parfums
(40, 9, 'heart'), -- Rose
(40, 33, 'top'),  -- Safran
(40, 22, 'base'), -- Oud
(40, 18, 'base'), -- Ambre gris
(41, 33, 'top'),  -- Safran
(41, 3, 'top'),   -- Mandarine
(41, 19, 'base'), -- Musc blanc
(41, 18, 'base'), -- Ambre gris
(42, 1, 'top'),   -- Bergamote
(42, 3, 'top'),   -- Mandarine
(42, 4, 'top'),   -- Pamplemousse
(42, 34, 'heart'),-- Prune
(42, 18, 'base'), -- Ambre gris
(43, 9, 'heart'), -- Rose
(43, 18, 'base'), -- Ambre gris
(44, 10, 'top'),  -- Lavande
(44, 50, 'heart'),-- Estragon
(44, 49, 'heart'),-- Clou de girofle
(44, 43, 'top'),  -- Canelle
(45, 9, 'heart'), -- Rose
(45, 8, 'heart'), -- Jasmin
(46, 15, 'heart'),-- Cèdre
(46, 24, 'heart'),-- Vétiver
(47, 15, 'heart'),-- Cèdre
(47, 37, 'base'), -- Tabac
(47, 20, 'base'), -- Vanille
(47, 16, 'base'), -- Santal
(48, 9, 'heart'), -- Rose
(48, 8, 'heart'), -- Jasmin
(49, 10, 'top'),  -- Lavande
(49, 50, 'heart'),-- Estragon
(49, 43, 'heart'),-- Canelle
(50, 34, 'heart'),-- Prune
(50, 33, 'top'),  -- Safran
(50, 22, 'base'), -- Oud
(50, 20, 'base'), -- Vanille
(51, 23, 'top'),  -- Encens
(51, 6, 'top'),   -- Poivre rose
(51, 9, 'heart'), -- Rose
-- Frédéric Malle
(52, 8, 'heart'), -- Jasmin
(52, 9, 'heart'), -- Rose
(52, 19, 'base'), -- Musc blanc
(53, 14, 'heart'),-- Iris
(53, 8, 'heart'), -- Jasmin
(53, 19, 'base'), -- Musc blanc
(54, 8, 'heart'), -- Jasmin
(54, 9, 'heart'), -- Rose
(54, 39, 'heart'),-- Muguet
(55, 22, 'base'), -- Oud
(55, 18, 'base'), -- Ambre gris
(55, 9, 'heart'), -- Rose
(56, 20, 'base'), -- Vanille
(56, 16, 'base'), -- Santal
(56, 19, 'base'), -- Musc blanc
(57, 9, 'heart'), -- Rose
(57, 18, 'base'), -- Ambre gris
(57, 23, 'base'), -- Encens
(58, 22, 'base'), -- Oud
(58, 9, 'heart'), -- Rose
(58, 18, 'base'); -- Ambre gris

-- REVIEW
INSERT INTO review (id, rating, comment, review_date, user_id, perfume_id) VALUES
  (1, 5, 'Incroyable tenue et sillage.', NOW(), 2, 1),
  (2, 4, 'Très frais et boisé.', NOW(), 2, 2);

-- USER COLLECTION
INSERT INTO user_collection (user_id, perfume_id, status, added_date) VALUES
  (2, 1, 'wishlist', NOW()),
  (2, 2, 'tested', NOW());
