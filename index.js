import express from 'express';
import morgan from 'morgan';
const app = express();

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// Importer les routes
import methoderoutes from './src/routes/taches.routes.js';
app.use('/', methoderoutes);

// Middleware Morgan
app.use((err, req, res, next) => {
  console.error(`500 Error - ${req.method} ${req.originalUrl}`);
  console.error(err.stack);
  res.status(500).json({ message: "Une erreur est survenue sur le serveur." });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5432;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});


/*
1) Hasher les mots de passe
2) OK  Faire en sorte que tout ce qui touche au tâche le soit par l'utilisateur même (Need?)
3) Faire tous les tests POSTMAN
4) Faire les logs d'erreurs 500 dans un fichier.
5) Interface de gesƟon des uƟlisateurs
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
