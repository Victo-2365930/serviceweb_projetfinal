// src/models/taches.models.js
import db from '../config/db.js';

const listerTachesUtilisateur = (utilisateurID, termine) => {
    return new Promise((resolve, reject) => {
        const requete = 'SELECT * FROM taches WHERE utilisateur_id = $1' + (termine == 0 ? ' AND complete = false' : '');
        db.query(requete, [utilisateurID], (erreur, resultat) => {
            if (erreur) reject(erreur);
            else resolve(resultat.rows);
        });
    });
};

const ajouterTacheModel = (tache) => {
    const { utilisateur_id, titre, description, date_debut, date_echeance, complete } = tache;
    const requete = `INSERT INTO taches (utilisateur_id, titre, description, date_debut, date_echeance, complete)
                        VALUES ($1, $2, $3, $4, $5, $6)`;
    const valeurs = [utilisateur_id, titre, description, date_debut, date_echeance, complete];
    return db.query(requete, valeurs);
};

const ajouterSousTacheModel = (tache_id, titre, complete) => {
    const requete = `INSERT INTO sous_taches (tache_id, titre, complete) VALUES ($1, $2, $3)`;
    return db.query(requete, [tache_id, titre, complete]);
};

const modifierTacheModel = (tache) => {
    const { id, titre, description, date_debut, date_echeance } = tache;
    const requete = `UPDATE taches SET titre = $1, description = $2, date_debut = $3, date_echeance = $4 WHERE id = $5`;
    return db.query(requete, [titre, description, date_debut, date_echeance, id]);
};

const modifierStatutTacheModel = (id, complete) => {
    const requete = `UPDATE taches SET complete = $1 WHERE id = $2`;
    return db.query(requete, [complete, id]);
};

const modifierStatutSousTacheModel = (id, complete) => {
    const requete = `UPDATE sous_taches SET complete = $1 WHERE id = $2`;
    return db.query(requete, [complete, id]);
};

const modifierSousTacheModel = (sousTache) => {
    const { id, titre, complete } = sousTache;
    const requete = `UPDATE sous_taches SET titre = $1, complete = $2 WHERE id = $3`;
    return db.query(requete, [titre, complete, id]);
};

const supprimerTacheModel = (id) => {
    return db.query(`DELETE FROM sous_taches WHERE tache_id = $1`, [id])
        .then(() => db.query(`DELETE FROM taches WHERE id = $1`, [id]));
};

const supprimerSousTacheModel = (id) => {
    return db.query(`DELETE FROM sous_taches WHERE id = $1`, [id]);
};

const afficherTacheAvecSousTaches = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const tache = await db.query(`SELECT * FROM taches WHERE id = $1`, [id]);
            const sousTaches = await db.query(`SELECT * FROM sous_taches WHERE tache_id = $1`, [id]);
            if (tache.rows.length === 0) return resolve(null);
            const resultat = tache.rows[0];
            resultat.sous_taches = sousTaches.rows;
            resolve(resultat);
        } catch (erreur) {
            reject(erreur);
        }
    });
};

const ajouterUtilisateurModel = (nom, prenom, courriel, password, cle_api) => {
    const requete = `INSERT INTO utilisateurs (nom, prenom, courriel, password, cle_api)
                        VALUES ($1, $2, $3, $4, $5) RETURNING cle_api`;
    return db.query(requete, [nom, prenom, courriel, password, cle_api]);
};

const trouverCleApiModel = (courriel, password) => {
    const requete = `SELECT cle_api FROM utilisateurs WHERE courriel = $1 AND password = $2`;
    return db.query(requete, [courriel, password]);
};

const ValidationCle = (cleApi) => {
    const requete = `SELECT * FROM utilisateurs WHERE cle_api = $1`;
    return db.query(requete, [cleApi]).then(result => result.rows[0]);
};

export {
    listerTachesUtilisateur,
    ajouterTacheModel,
    ajouterSousTacheModel,
    modifierTacheModel,
    modifierStatutTacheModel,
    modifierStatutSousTacheModel,
    modifierSousTacheModel,
    supprimerTacheModel,
    supprimerSousTacheModel,
    afficherTacheAvecSousTaches,
    ajouterUtilisateurModel,
    trouverCleApiModel,
    ValidationCle
};