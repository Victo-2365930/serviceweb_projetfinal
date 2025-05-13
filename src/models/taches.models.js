import db from '../config/db.js';

//Afficher les données

const listerTachesUtilisateur = (utilisateurID, termine) => {
    return new Promise((resolve, reject) => {
        const requete = 'SELECT * FROM taches WHERE utilisateur_id = $1' + (termine == 1 ? '' : ' AND complete = false');
        db.query(requete, [utilisateurID], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            resolve(resultat.rows);
        });
    });
};

const afficherTacheAvecSousTaches = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM taches WHERE id = $1', [id], (erreur, res1) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            if (res1.rows.length === 0) return resolve(null);

            db.query('SELECT * FROM sous_taches WHERE tache_id = $1', [id], (erreur2, res2) => {
                if (erreur2) {
                    console.log(`Erreur sqlState ${erreur2.sqlState} : ${erreur2.message}`);
                    return reject(erreur2);
                }
                const resultat = res1.rows[0];
                resultat.sous_taches = res2.rows;
                resolve(resultat);
            });
        });
    });
};

//Méthodes pour les *Tâches*

const ajouterTache = (tache) => {
    return new Promise((resolve, reject) => {
        const { utilisateur_id, titre, description, date_debut, date_echeance} = tache;
        const requete = `
            INSERT INTO taches (utilisateur_id, titre, description, date_debut, date_echeance)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const valeurs = [utilisateur_id, titre, description, date_debut, date_echeance, false];
        db.query(requete, valeurs, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            resolve(resultat);
        });
    });
};

const modifierTache = ({ tacheId, titre, description, date_debut, date_echeance }) => {
    return new Promise((resolve, reject) => {
        const requete = `
            UPDATE taches
            SET titre = $1, description = $2, date_debut = $3, date_echeance = $4
            WHERE id = $5
        `;
        db.query(requete, [titre, description, date_debut, date_echeance, tacheId], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            resolve(resultat);
        });
    });
};

const modifierStatutTache = (id) => {
    return new Promise((resolve, reject) => {
        const requete = `
            UPDATE taches
            SET complete = NOT complete
            WHERE id = $1
        `;
        db.query(requete, [id], (erreur, resultat) => {
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
        db.query('DELETE FROM sous_taches WHERE tache_id = $1', [id], (erreur) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            db.query('DELETE FROM taches WHERE id = $1', [id], (erreur2, resultat) => {
                if (erreur2) {
                    console.log(`Erreur sqlState ${erreur2.sqlState} : ${erreur2.message}`);
                    return reject(erreur2);
                }
                resolve(resultat);
            });
        });
    });
};

//Méthodes pour les *Sous-tâches*

const ajouterSousTache = (tache_id, titre) => {
    return new Promise((resolve, reject) => {
        const requete = `
            INSERT INTO sous_taches (tache_id, titre, complete)
            VALUES ($1, $2, $3)
        `;
        db.query(requete, [tache_id, titre, false], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            resolve(resultat);
        });
    });
};

const modifierSousTache = ({ sousTacheId, titre }) => {
    return new Promise((resolve, reject) => {
        const requete = `
            UPDATE sous_taches
            SET titre = $1
            WHERE id = $2
        `;
        db.query(requete, [titre, sousTacheId], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            resolve(resultat);
        });
    });
};

const modifierStatutSousTache = (sousTacheId) => {
    return new Promise((resolve, reject) => {
        const requete = `
            UPDATE sous_taches
            SET complete = NOT complete
            WHERE id = $1
        `;
        db.query(requete, [sousTacheId], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            resolve(resultat);
        });
    });
};

const supprimerSousTache = (id) => {
    return new Promise((resolve, reject) => {
        const requete = `
            DELETE FROM sous_taches
            WHERE id = $1
        `;
        db.query(requete, [id], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            resolve(resultat);
        });
    });
};

//Intéraction page web

const ajouterUtilisateur = (nom, prenom, courriel, password, cle_api) => {
    return new Promise((resolve, reject) => {
        const requete = `
            INSERT INTO utilisateurs (nom, prenom, courriel, password, cle_api)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING cle_api
        `;
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
        const requete = `
            SELECT cle_api
            FROM utilisateurs
            WHERE courriel = $1 AND password = $2
        `;
        db.query(requete, [courriel, password], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            resolve(resultat);
        });
    });
};

//Méthodes utilitaires

const ValidationCle = (cleApi) => {
    return new Promise((resolve, reject) => {
        const requete = `
            SELECT id
            FROM utilisateurs
            WHERE cle_api = $1
        `;
        db.query(requete, [cleApi], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            resolve(resultat.rows[0]);
        });
    });
};

const verifierProprietaireTache = (tacheId, utilisateurId) => {
    return new Promise((resolve, reject) => {
        const requete = `SELECT utilisateur_id FROM taches WHERE id = $1`;
        db.query(requete, [tacheId], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            if (resultat.rows.length > 0 && resultat.rows[0].utilisateur_id === utilisateurId) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
};

const verifierProprietaireSousTache = (sousTacheId, utilisateurId) => {
    return new Promise((resolve, reject) => {
        const requete = `
            SELECT taches.utilisateur_id
            FROM sous_taches
            JOIN taches ON sous_taches.tache_id = taches.id
            WHERE sous_taches.id = $1
        `;
        db.query(requete, [sousTacheId], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            if (resultat.rows.length > 0 && resultat.rows[0].utilisateur_id === utilisateurId) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
};

const recupererTacheIdSousTache = (sousTacheId) => {
    return new Promise((resolve, reject) => {
        const requete = `
            SELECT tache_id
            FROM sous_taches
            WHERE id = $1
        `;
        db.query(requete, [sousTacheId], (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.message}`);
                return reject(erreur);
            }
            if (resultat.rows.length > 0) {
                resolve(resultat.rows[0].tache_id);
            } else {
                resolve(null);
            }
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
    ValidationCle, verifierProprietaireTache,
    verifierProprietaireSousTache,
    recupererTacheIdSousTache
};