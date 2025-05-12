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


/*
1) Hasher les mots de passe
2) Faire en sorte que tout ce qui touche au tâche le soit par l'utilisateur même (Need?)
3) Faire tous les tests POSTMAN
4) Interface de gesƟon des uƟlisateurs
- Vous devez créer une page HTML avec un script JavaScript qui fournit une interface
permeƩant de :
o Créer un nouvel uƟlisateur
o Récupérer ou régénérer une nouvelle clé api.
- UƟlisez la foncƟon Fetch en JavaScript pour interagir avec les deux routes de gesƟon des
uƟlisateurs de votre api.
- Vous trouverez à l’annexe B un « wireframe » de la page à créer. Vous devez vous le
reproduire le plus fidèlement possible.
5)Doc (DO I even have time!?!?)

*/
