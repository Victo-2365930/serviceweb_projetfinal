import { ValidationCle } from "../models/taches.models.js";

const authentification = (req, res, next) => {

    // Vérifier si la clé API est présente dans l'entête
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "Vous devez fournir une clé api" });
    }

    // Récupérer la clé API qui est dans l'entête au format "cle_api XXXXXXXX"
    const cleApi = req.headers.authorization.split(' ')[1];

    // Vérifier si la clé API est valide
    ValidationCle(cleApi)
        .then(resultat => {
            if (!resultat) {
                return res.status(401).json({ message: "Clé API invalide" });
            } else {
                // Clé API valide : on attache l'utilisateur à la requête (optionnel)
                req.utilisateur = resultat;
                next();
            }
        })
        .catch(erreur => {
            return res.status(500).json({ message: "Erreur lors de la validation de la clé api" });
        });
};

export default authentification;