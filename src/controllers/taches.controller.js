// Importer le fichier de models
import {listerTachesUtilisateur} from "../src/models/taches.models.js";

const ListeTacheParUser = async (req,res) => {
    const utilisateur = req.query.utilisateur;
    const termine = req.query.termine; //0 = Exclure les taches terminées, 1 = Inclure les tâches terminées
    try { 
        const listeTachesUtilisateur = await listerTachesUtilisateur(utilisateur, termine);
        if (listeTachesUtilisateur.length == 0) {
            res.status(404).send(`Aucune tâche trouvée dans la liste avec l'utilisateur type ${utilisateur}`);
            
        } else {
            res.status(200).send(listeTachesUtilisateur);
        }
    } 
    catch (erreur) {
        res.status(500).send(`Echec lors de la récupération de la liste des taches`);
    }
}


export{ListeTacheParUser, AfficherTache, AjouterTache, ModifierTache,ModifierSTache,SupprimerTache, AjouterUtilisateur, AvoirCleApi};