import {
    listerTachesUtilisateur, ajouterTache,
    ajouterSousTache, modifierTache,
    modifierStatutTache, modifierStatutSousTache,
    supprimerTache, afficherTacheAvecSousTaches,
    ajouterUtilisateur, trouverCleApi, modifierSousTache,
    supprimerSousTache, verifierProprietaireTache, 
    verifierProprietaireSousTache, recupererTacheIdSousTache
} from "../models/taches.models.js";

import {createRandomString} from "../utils/generercleapi.js";
import db from '../config/db.js';
import bcrypt from "bcrypt";

const ListeTacheParUtilisateur = async (req, res) => {
    const utilisateur_id = req.id;
    const termine = req.query.termine; // Si == inclure les tâches terminées
    try {
        const liste = await listerTachesUtilisateur(utilisateur_id, termine);
        res.status(200).json(liste);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des tâches" });
    }
};

const AfficherTache = async (req, res) => {
    const tacheId = req.params.id;
    const utilisateur_id = req.id;
    try {
        const tache = await afficherTacheAvecSousTaches(tacheId);
        if (!tache) return res.status(404).json({ message: "Tâche non trouvée" });
        if (tache.utilisateur_id !== utilisateur_id) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à voir cette tâche." });
        }
        res.status(200).json(tache);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération de la tâche" });
    }
};

const AjouterTache = async (req, res) => {
    const { titre, description, date_debut, date_echeance } = req.body;
    const utilisateur_id = req.id;
    try {
        await ajouterTache({ utilisateur_id, titre, description, date_debut, date_echeance });
        res.status(201).json({ message: "Tâche ajoutée" });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de l'ajout de la tâche" });
    }
};

const ModifierTache = async (req, res) => {
    const tacheId = req.params.id;
    const utilisateur_id = req.id;
    const { titre, description, date_debut, date_echeance } = req.body;
    try {
        const estProprietaire = await verifierProprietaireTache(tacheId, utilisateur_id);
        if (!estProprietaire) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier cette tâche." });
        }
        await modifierTache({ tacheId, titre, description, date_debut, date_echeance });
        res.status(200).json({ message: "Tâche modifiée" });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la modification" });
    }
};

const ModifierStatutTache = async (req, res) => {
    const tacheId = req.params.id;
    const utilisateur_id = req.id;
    try {
        const estProprietaire = await verifierProprietaireTache(tacheId, utilisateur_id);
        if (!estProprietaire) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier cette tâche." });
        }
        await modifierStatutTache(tacheId);
        res.status(200).json({ message: "Statut de la tâche mis à jour" });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du statut de la tâche" });
    }
};

const SupprimerTache = async (req, res) => {
    const tacheId = req.params.id;
    const utilisateur_id = req.id;
    try {
        const estProprietaire = await verifierProprietaireTache(tacheId, utilisateur_id);
        if (!estProprietaire) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer cette tâche." });
        }
        await supprimerTache(tacheId);
        res.status(200).json({ message: "Tâche supprimée" });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la suppression de la tâche" });
    }
};

const AjouterSousTache = async (req, res) => {
    const { tache_id } = req.params;
    const utilisateur_id = req.id;
    const { titre } = req.body;
    try {
        const estProprietaire = await verifierProprietaireTache(tache_id, utilisateur_id);
        if (!estProprietaire) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à ajouter une sous-tâche à cette tâche." });
        }
        await ajouterSousTache(tache_id, titre);
        res.status(201).json({ message: "Sous-tâche ajoutée avec succès" });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de l'ajout de la sous-tâche" });
    }
};

const ModifierSousTache = async (req, res) => {
    const sousTacheId = req.params.id;
    const utilisateur_id = req.id;
    const { titre } = req.body;
    try {
        const estProprietaire = await verifierProprietaireSousTache(sousTacheId, utilisateur_id);
        if (!estProprietaire) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier cette sous-tâche." });
        }
        const tacheId = await recupererTacheIdSousTache(sousTacheId);
        if (tacheId) {
            await modifierSousTache({ sousTacheId, titre});
            res.status(200).json({ message: "Sous-tâche modifiée avec succès" });
        } else {
            res.status(404).json({ message: "Sous-tâche non trouvée." });
        }
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la modification de la sous-tâche" });
    }
};

const ModifierStatutSousTache = async (req, res) => {
    const sousTacheId = req.params.id;
    const utilisateur_id = req.id;
    try {
        const estProprietaire = await verifierProprietaireSousTache(sousTacheId, utilisateur_id);
        if (!estProprietaire) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier le statut de cette sous-tâche." });
        }
        const tacheId = await recupererTacheIdSousTache(sousTacheId);
        if (tacheId) {
            await modifierStatutSousTache(sousTacheId);
            res.status(200).json({ message: "Statut de la sous-tâche mis à jour" });
        } else {
            res.status(404).json({ message: "Sous-tâche non trouvée." });
        }
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du statut de la sous-tâche" });
    }
};

const SupprimerSousTache = async (req, res) => {
    const sousTacheId = req.params.id;
    const utilisateur_id = req.id;
    try {
        const estProprietaire = await verifierProprietaireSousTache(sousTacheId, utilisateur_id);
        if (!estProprietaire) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer cette sous-tâche." });
        }
        const tacheId = await recupererTacheIdSousTache(sousTacheId);
        if (tacheId) {
            await supprimerSousTache(sousTacheId);
            res.status(200).json({ message: "Sous-tâche supprimée avec succès." });
        } else {
            res.status(404).json({ message: "Sous-tâche non trouvée." });
        }
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la suppression de la sous-tâche" });
    }
};

const AjouterUtilisateur = async (req, res) => {
    const { nom, prenom, courriel, password } = req.body;
    const cle_api = createRandomString();
    try {
        const hash = await bcrypt.hash(password, 10);
        const result = await ajouterUtilisateur(nom, prenom, courriel, hash, cle_api);
        res.status(201).json({ cle_api: result.rows[0].cle_api });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la création de l'utilisateur" });
    }
};

const AvoirCleApi = async (req, res) => {
    const { courriel, password, regen } = req.body;
    try {
        const result = await trouverCleApi(courriel);
        if (result.rows.length === 0) return res.status(401).json({ message: "Identifiants invalides" });

        const utilisateur = result.rows[0];
        const passwordOk = await bcrypt.compare(password, utilisateur.password);
        if (!passwordOk) return res.status(401).json({ message: "Identifiants invalides" });

        if (regen === 'true') {
            const nouvelleCle = createRandomString();
            await db.query('UPDATE utilisateurs SET cle_api = $1 WHERE id = $2', [nouvelleCle, utilisateur.id]);
            return res.status(200).json({ cle_api: nouvelleCle });
        }

        res.status(200).json({ cle_api: utilisateur.cle_api });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération de la clé api" });
    }
};

export {
    ListeTacheParUtilisateur, AfficherTache,
    AjouterTache, ModifierTache,
    ModifierStatutTache, SupprimerTache,
    AjouterUtilisateur, AvoirCleApi,
    AjouterSousTache, ModifierSousTache,
    ModifierStatutSousTache, SupprimerSousTache
};