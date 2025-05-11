// src/controllers/taches.controller.js
import {
    listerTachesUtilisateur, ajouterTacheModel,
    ajouterSousTacheModel, modifierTacheModel,
    modifierStatutTacheModel, modifierStatutSousTacheModel,
    supprimerTacheModel, afficherTacheAvecSousTaches,
    ajouterUtilisateurModel, trouverCleApiModel,
    ValidationCle
} from "../models/taches.models.js";

import { createRandomString } from "../utils/generercleapi.js";
import db from '../config/db.js';

const ListeTacheParUser = async (req, res) => {
    const utilisateur = req.query.utilisateur;
    const termine = req.query.termine;
    try {
        const liste = await listerTachesUtilisateur(utilisateur, termine);
        res.status(200).json(liste);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération des tâches" });
    }
};

const AfficherTache = async (req, res) => {
    const { id } = req.params;
    try {
        const tache = await afficherTacheAvecSousTaches(id);
        if (!tache) return res.status(404).json({ message: "Tâche non trouvée" });
        res.status(200).json(tache);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération de la tâche" });
    }
};

const AjouterTache = async (req, res) => {
    const { utilisateur_id, titre, description, date_debut, date_echeance, complete } = req.body;
    try {
        await ajouterTacheModel({ utilisateur_id, titre, description, date_debut, date_echeance, complete });
        res.status(201).json({ message: "Tâche ajoutée" });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de l'ajout de la tâche" });
    }
};

const ModifierTache = async (req, res) => {
    const { id } = req.params;
    const { titre, description, date_debut, date_echeance } = req.body;
    try {
        await modifierTacheModel({ id, titre, description, date_debut, date_echeance });
        res.status(200).json({ message: "Tâche modifiée" });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la modification" });
    }
};

const ModifierSTache = async (req, res) => {
    const { id } = req.params;
    const { complete } = req.body;
    try {
        await modifierStatutTacheModel(id, complete);
        res.status(200).json({ message: "Statut de la tâche mis à jour" });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du statut de la tâche" });
    }
};

const SupprimerTache = async (req, res) => {
    const { id } = req.params;
    try {
        await supprimerTacheModel(id);
        res.status(200).json({ message: "Tâche supprimée" });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la suppression de la tâche" });
    }
};

const AjouterUtilisateur = async (req, res) => {
    const { nom, prenom, courriel, password } = req.body;
    const cle_api = createRandomString();
    try {
        const result = await ajouterUtilisateurModel(nom, prenom, courriel, password, cle_api);
        res.status(201).json({ cle_api: result.rows[0].cle_api });
    } catch (err) {
        console.error("Erreur SQL :", err); 
        res.status(500).json({ message: "Erreur lors de la création de l'utilisateur" });
    }
};


const AvoirCleApi = async (req, res) => {
    const { courriel, password, regen } = req.query;
    try {
        if (regen == '1') {
            const nouvelleCle = createRandomString();
            await db.query(`UPDATE utilisateurs SET cle_api = $1 WHERE courriel = $2 AND password = $3`, [nouvelleCle, courriel, password]);
            return res.status(200).json({ cle_api: nouvelleCle });
        }
        const result = await trouverCleApiModel(courriel, password);
        if (result.rows.length === 0) return res.status(401).json({ message: "Identifiants invalides" });
        res.status(200).json({ cle_api: result.rows[0].cle_api });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la récupération de la clé api" });
    }
};

const AjouterSousTache = async (req, res) => {
    const { tache_id } = req.params;
    const { titre, complete } = req.body;
    try {
        await ajouterSousTacheModel(tache_id, titre, complete);
        const tache = await afficherTacheAvecSousTaches(tache_id);
        res.status(201).json(tache);
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de l'ajout de la sous-tâche" });
    }
};

const ModifierSousTache = async (req, res) => {
    const { id } = req.params;
    const { titre, complete } = req.body;
    try {
        const sousTache = await db.query('SELECT tache_id FROM sous_taches WHERE id = $1', [id]);
        await modifierSousTacheModel({ id, titre, complete });
        if (sousTache.rows.length > 0) {
            const tache = await afficherTacheAvecSousTaches(sousTache.rows[0].tache_id);
            res.status(200).json(tache);
        } else {
            res.status(200).json({ message: "Sous-tâche modifiée" });
        }
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la modification de la sous-tâche" });
    }
};

const ModifierStatutSousTache = async (req, res) => {
    const { id } = req.params;
    const { complete } = req.body;
    try {
        const sousTache = await db.query('SELECT tache_id FROM sous_taches WHERE id = $1', [id]);
        await modifierStatutSousTacheModel(id, complete);
        if (sousTache.rows.length > 0) {
            const tache = await afficherTacheAvecSousTaches(sousTache.rows[0].tache_id);
            res.status(200).json(tache);
        } else {
            res.status(200).json({ message: "Statut de la sous-tâche mis à jour" });
        }
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du statut de la sous-tâche" });
    }
};

const SupprimerSousTache = async (req, res) => {
    const { id } = req.params;
    try {
        const sousTache = await db.query('SELECT tache_id FROM sous_taches WHERE id = $1', [id]);
        await db.query('DELETE FROM sous_taches WHERE id = $1', [id]);
        if (sousTache.rows.length > 0) {
            const tache = await afficherTacheAvecSousTaches(sousTache.rows[0].tache_id);
            res.status(200).json(tache);
        } else {
            res.status(200).json({ message: "Sous-tâche supprimée" });
        }
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la suppression de la sous-tâche" });
    }
};

export {
    ListeTacheParUser,
    AfficherTache,
    AjouterTache,
    ModifierTache,
    ModifierSTache,
    SupprimerTache,
    AjouterUtilisateur,
    AvoirCleApi,
    AjouterSousTache,
    ModifierSousTache,
    ModifierStatutSousTache,
    SupprimerSousTache
};