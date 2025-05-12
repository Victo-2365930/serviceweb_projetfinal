// src/models/taches.models.js
import db from '../config/db.js';

const listerTachesUtilisateur = (utilisateurID, termine) => {
    return new Promise((resolve, reject) => {
        const requete = 'SELECT * FROM taches WHERE utilisateur_id = $1' + (termine == 0 ? ' AND complete = false' : '');
        db.query(requete, [utilisateurID], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            resolve(resultat.rows);
        });
    });
};

const ajouterTache = (tache) => {
    return new Promise((resolve, reject) => {
        const { utilisateur_id, titre, description, date_debut, date_echeance, complete } = tache;
        const requete = `INSERT INTO taches (utilisateur_id, titre, description, date_debut, date_echeance, complete)
                         VALUES ($1, $2, $3, $4, $5, $6)`;
        const valeurs = [utilisateur_id, titre, description, date_debut, date_echeance, complete];
        db.query(requete, valeurs, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            resolve(resultat);
        });
    });
};

const ajouterSousTache = (tache_id, titre, complete) => {
    return new Promise((resolve, reject) => {
        const requete = `INSERT INTO sous_taches (tache_id, titre, complete) VALUES ($1, $2, $3)`;
        db.query(requete, [tache_id, titre, complete], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            resolve(resultat);
        });
    });
};

const modifierTache = ({ id, titre, description, date_debut, date_echeance }) => {
    return new Promise((resolve, reject) => {
        const requete = `UPDATE taches SET titre = $1, description = $2, date_debut = $3, date_echeance = $4 WHERE id = $5`;
        db.query(requete, [titre, description, date_debut, date_echeance, requete.id], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            resolve(resultat);
        });
    });
};

const modifierStatutTache = (id, complete) => {
    return new Promise((resolve, reject) => {
        const requete = `UPDATE taches SET complete = $1 WHERE id = $2`;
        db.query(requete, [complete, id], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            resolve(resultat);
        });
    });
};

const modifierStatutSousTache = (id, complete) => {
    return new Promise((resolve, reject) => {
        const requete = `UPDATE sous_taches SET complete = $1 WHERE id = $2`;
        db.query(requete, [complete, id], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            resolve(resultat);
        });
    });
};

const modifierSousTache = ({ id, titre, complete }) => {
    return new Promise((resolve, reject) => {
        const requete = `UPDATE sous_taches SET titre = $1, complete = $2 WHERE id = $3`;
        db.query(requete, [titre, complete, id], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            resolve(resultat);
        });
    });
};

const supprimerTache = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM sous_taches WHERE tache_id = $1`, [id], (erreur) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            db.query(`DELETE FROM taches WHERE id = $1`, [id], (erreur2, resultat) => {
                if (erreur2) {
                    console.log(`Erreur sqlState ${erreur2.sqlState} : ${erreur2.message}`);
                    return reject(erreur2);
                }
                resolve(resultat);
            });
        });
    });
};

const supprimerSousTache = (id) => {
    return new Promise((resolve, reject) => {
        const requete = `DELETE FROM sous_taches WHERE id = $1`;
        db.query(requete, [id], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            resolve(resultat);
        });
    });
};

const afficherTacheAvecSousTaches = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM taches WHERE id = $1`, [id], (err1, res1) => {
            if (err1) {
                console.log(`Erreur sqlState ${err1.sqlState} : ${err1.message}`);
                return reject(err1);
            }
            if (res1.rows.length === 0) return resolve(null);

            db.query(`SELECT * FROM sous_taches WHERE tache_id = $1`, [id], (err2, res2) => {
                if (err2) {
                    console.log(`Erreur sqlState ${err2.sqlState} : ${err2.message}`);
                    return reject(err2);
                }
                const resultat = res1.rows[0];
                resultat.sous_taches = res2.rows;
                resolve(resultat);
            });
        });
    });
};

const ajouterUtilisateur = (nom, prenom, courriel, password, cle_api) => {
    return new Promise((resolve, reject) => {
        const requete = `INSERT INTO utilisateurs (nom, prenom, courriel, password, cle_api)
                         VALUES ($1, $2, $3, $4, $5) RETURNING cle_api`;
        db.query(requete, [nom, prenom, courriel, password, cle_api], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            resolve(resultat);
        });
    });
};

const trouverCleApi = (courriel, password) => {
    return new Promise((resolve, reject) => {
        const requete = `SELECT cle_api FROM utilisateurs WHERE courriel = $1 AND password = $2`;
        db.query(requete, [courriel, password], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            resolve(resultat);
        });
    });
};

const ValidationCle = (cleApi) => {
    return new Promise((resolve, reject) => {
        const requete = `SELECT * FROM utilisateurs WHERE cle_api = $1`;
        db.query(requete, [cleApi], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            resolve(resultat.rows[0]);
        });
    });
};

export {
    listerTachesUtilisateur, ajouterTache,
    ajouterSousTache, modifierTache,
    modifierStatutTache, modifierStatutSousTache,
    modifierSousTache, supprimerTache,
    supprimerSousTache, afficherTacheAvecSousTaches,
    ajouterUtilisateur, trouverCleApi, 
    ValidationCle};
