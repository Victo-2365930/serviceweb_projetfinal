import { ValidationCle } from "../models/taches.models.js";

const authentification = (req, res, next) => {

    // Vérifier si la clé API est présente dans le header
    if (!req.headers.authorization) {
        return res.status(401).json({ message: "Vous devez fournir une clé api" });
    }

    // Récupérer la clé API  (28 caractères aléatoires)
    const cleApi = req.headers.authorization;

    // Vérifier si la clé API est valide
    ValidationCle(cleApi)
        .then(resultat => {
            if (!resultat) {
                return res.status(401).json({ message: "Clé API invalide" });
            } else {
                req.id = resultat.id;
                next();
                return;
            }
        })
        .catch(erreur => {
            return res.status(500).json({ message: "Erreur lors de la validation de la clé api" });
        });
};

export default authentification;