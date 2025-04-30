import express from 'express';

// Créer une application express
const app = express();

// Importer les middlewares
app.use(express.json());

// Importer le fichier de router du fichier salutations.route
import methoderoutes from './src/routes/taches.routes.js';

// On associe la route / au router importé
app.use('/', methoderoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 5432;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});