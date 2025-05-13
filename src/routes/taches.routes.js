import express from 'express';
import {
    ListeTacheParUtilisateur, AfficherTache, AjouterTache, ModifierTache,
    ModifierStatutTache, SupprimerTache, AjouterUtilisateur, AvoirCleApi,
    AjouterSousTache, ModifierSousTache, SupprimerSousTache, ModifierStatutSousTache
} from "../controllers/taches.controller.js";
import authentification from "../middlewares/authentification.middleware.js";

const router = express.Router();

/*
 Afficher toutes les tâches de l'usager
 Par défaut seulement les tâches incomplètes seront affichées mais vous devez permettre
 l’option de les afficher toutes
 **Clé API requise**
 Header: termine = 1 pour afficher toutes les taches, rien pour seulement les taches non-complétés
ok*/
router.get('/taches', authentification, ListeTacheParUtilisateur);

/*
 Afficher le détail d'une tâche
 Son titre, sa description, son statut, sa date de début et
 d’échéance et la liste de ses soustâches ainsi qu’un indiquant détaillant
 si la sous-tâche est terminée ou non.
 **Clé API requise**
ok*/
router.get('/taches/:id', authentification, AfficherTache);

/*
 Ajouter une tâche
 **Clé API requise**
ok*/
router.post('/taches', authentification, AjouterTache);

/* 
 Modifier une tâche
 **Clé API requise**
ok*/
router.put('/taches/:id', authentification, ModifierTache);

/*
 Modifier le statut d'une tâche
 **Clé API requise**
ok*/
router.patch('/taches/statut/:id', authentification, ModifierStatutTache);

/*
 Supprimer une tâche
 **Clé API requise**
ok*/
router.delete('/taches/:id', authentification, SupprimerTache);

/*
 Ajouter une sous-tâche à une tâche spécifique
 **Clé API requise**
ok*/
router.post('/taches/:tache_id/sous-taches', authentification, AjouterSousTache);

/* 
 Modifier une sous-tâche spécifique
 **Clé API requise**
ok*/
router.put('/sous-taches/:id', authentification, ModifierSousTache);

/*
 Modifier le statut d'une sous-tâche spécifique
 **Clé API requise**
ok*/
router.patch('/sous-taches/statut/:id', authentification, ModifierStatutSousTache);

/*
 Supprimer une sous-tâche spécifique
 **Clé API requise**
ok*/
router.delete('/sous-taches/:id', authentification, SupprimerSousTache);

/*
Ajouter un utilisateur
La route doit prendre en paramètre un nom, un prénom, une adresse courriel et un mot
de passe, créer l’usager dans le système et lui retourner une clé API.
ok*/
router.post('/utilisateurs', AjouterUtilisateur);

/*
Récupérer sa clé API ou en redemander une nouvelle
En fournissant une adresse courriel et le bon mot de passe le système va retourner la clé
API de l’utilisateur. Un paramètre optionnel permet de générer une nouvelle clé et de la
retourner à l’utilisateur.
*/
router.post('/cle-api', AvoirCleApi);

export default router;