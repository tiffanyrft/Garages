
-- =====================================================
-- PROJET : Simulation de Garage
-- BASE DE DONNEES : PostgreSQL
-- DESCRIPTION : Schéma SQL basé sur le MLD validé
-- =====================================================

CREATE DATABASE garage;

\c garage;

-- =========================
-- TABLE : client
-- =========================
CREATE TABLE client (
    id_client SERIAL PRIMARY KEY,         -- Identifiant unique du client
    nom VARCHAR(100) NOT NULL,             -- Nom du client
    prenom VARCHAR(100) NOT NULL,          -- Prénom du client
    telephone VARCHAR(30) NOT NULL,        -- Numéro de téléphone
    email VARCHAR(150) UNIQUE NOT NULL,    -- Email du client
    mot_de_passe TEXT NOT NULL             -- Mot de passe (hashé)
);

-- =========================
-- TABLE : voiture
-- =========================
CREATE TABLE voiture (
    id_voiture SERIAL PRIMARY KEY,         -- Identifiant unique de la voiture
    marque VARCHAR(100) NOT NULL,          -- Marque de la voiture
    modele VARCHAR(100) NOT NULL,          -- Modèle
    immatriculation VARCHAR(50) UNIQUE NOT NULL, -- Immatriculation
    statut VARCHAR(30) NOT NULL,           -- en_attente, en_reparation, terminee
    id_client INT NOT NULL,                -- Client propriétaire

    CONSTRAINT fk_voiture_client
        FOREIGN KEY (id_client)
        REFERENCES client(id_client)
        ON DELETE CASCADE
);

-- =========================
-- TABLE : intervention
-- =========================
CREATE TABLE intervention (
    id_intervention SERIAL PRIMARY KEY,    -- Identifiant intervention
    nom_intervention VARCHAR(100) NOT NULL,-- Nom (frein, vidange, etc.)
    prix NUMERIC(10,2) NOT NULL,            -- Prix de l'intervention
    duree_seconde INT NOT NULL              -- Durée en secondes
);

-- =========================
-- TABLE : reparation
-- =========================
CREATE TABLE reparation (
    id_reparation SERIAL PRIMARY KEY,       -- Identifiant réparation
    etat VARCHAR(30) NOT NULL,              -- en_attente, en_cours, terminee
    date_debut TIMESTAMP,                   -- Début de réparation
    date_fin TIMESTAMP,                     -- Fin de réparation
    id_voiture INT NOT NULL,                -- Voiture concernée
    id_intervention INT NOT NULL,           -- Intervention effectuée

    CONSTRAINT fk_reparation_voiture
        FOREIGN KEY (id_voiture)
        REFERENCES voiture(id_voiture)
        ON DELETE CASCADE,

    CONSTRAINT fk_reparation_intervention
        FOREIGN KEY (id_intervention)
        REFERENCES intervention(id_intervention)
        ON DELETE RESTRICT
);

-- =========================
-- TABLE : paiement
-- =========================
CREATE TABLE paiement (
    id_paiement SERIAL PRIMARY KEY,         -- Identifiant paiement
    montant NUMERIC(10,2) NOT NULL,         -- Montant payé
    date_paiement TIMESTAMP NOT NULL,       -- Date du paiement
    statut VARCHAR(30) NOT NULL,            -- en_attente, paye
    id_voiture INT UNIQUE NOT NULL,          -- Une voiture = un paiement

    CONSTRAINT fk_paiement_voiture
        FOREIGN KEY (id_voiture)
        REFERENCES voiture(id_voiture)
        ON DELETE CASCADE
);

-- =========================
-- TABLE : slot
-- =========================
CREATE TABLE slot (
    id_slot SERIAL PRIMARY KEY,             -- Identifiant slot
    type_slot VARCHAR(30) NOT NULL,         -- reparation ou attente
    occupe BOOLEAN NOT NULL DEFAULT FALSE,  -- Indique si le slot est occupé
    id_voiture INT UNIQUE,                  -- Voiture présente dans le slot

    CONSTRAINT fk_slot_voiture
        FOREIGN KEY (id_voiture)
        REFERENCES voiture(id_voiture)
        ON DELETE SET NULL
);
-- Client admin
INSERT INTO client (nom, prenom, telephone, email, mot_de_passe) 
VALUES ('Admin', 'User', '0600000000', 'admin@garage.com', 'password_hash');

-- Interventions
INSERT INTO intervention (nom_intervention, prix, duree_secondes) 
VALUES ('Vidange', 50.00, 1800), ('Freinage', 120.00, 3600), ('Diagnostic', 80.00, 900);

-- Slots
INSERT INTO slot (nom_slot, type_slot) 
VALUES ('Slot 1', 'reparation'), ('Slot 2', 'reparation'), ('Attente', 'attente');

