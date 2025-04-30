import express from 'express';

import {ListeTacheParUser, AfficherTache, AjouterTache, ModifierTache,ModifierSTache,SupprimerTache, AjouterUtilisateur, AvoirCleApi} from "../src/controllers/taches.controller.js";

const router = express.Router();

/*
Afficher toutes les tâches de l'usager
Par défaut seulement les tâches incomplètes seront affichées mais vous devez permettre
l’option de les afficher toutes
*/
router.get('/liste', ListeTacheParUser);

/*
Afficher le détail d'une tâche
Son titre, sa description, son statut, sa date de début et 
d’échéance et la liste de ses soustâches ainsi qu’un indiquant détaillant 
si la sous-tâche est terminée ou non.
*/
router.get('/tache', AfficherTache);

//Ajouter une tâche
//Ajouter une sous-tâche
router.post('/ajoutertache', AjouterTache);

//Modifier une tâche
//Modifier une sous-tâche
router.put('/modifiertache', ModifierTache)

//Modifier le statut d'une tache
//Modifier le statut d'une sous-tâche
router.put('/modifierstache', ModifierSTache)

//Supprimer une tâche
//Supprimer une sous-tâche
router.delete('/supprimer/:id', SupprimerTache)

/*
Ajouter un utilisateur
La route doit prendre en paramètre un nom, un prénom, une adresse courriel et un mot
de passe, créer l’usager dans le système et lui retourner une clé api.
*/
router.post('/ajoutUtilisateur', AjouterUtilisateur);

/*
Récupérer sa clé api ou en redemander une nouvelle
En fournissant une adresse courriel et le bon mot de passe le système va retourner la clé
api de l’utilisateur. Un paramètre optionnel permet de générer une nouvelle clé et de la
retourner à l’utilisateur.
*/
router.get('/cleapi', AvoirCleApi);

export default router;