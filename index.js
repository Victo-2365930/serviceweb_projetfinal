import express from 'express';
const app = express();

// Importer les middlewares
app.use(express.json()); // <-- Assurez-vous que cette ligne est présente et avant vos routes.

// Importer le fichier de router du fichier taches.routes
import methoderoutes from './src/routes/taches.routes.js';

// On associe la route / au router importé
app.use('/', methoderoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 5432;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});