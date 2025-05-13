import express from 'express';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();

//Accepter les requetes de localhost//test
app.use(cors({
  origin: 'http://localhost'
}));

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// Importer les routes
import methoderoutes from './src/routes/taches.routes.js';
app.use('/', methoderoutes);

// Logger les erreurs 500
const logMorgan = fs.createWriteStream(path.join('journal_erreur.txt'), { flags: 'a' });
app.use(morgan('combined', {
  skip: (req, res) => res.statusCode < 500,
  stream: logMorgan
}));

// Démarrer le serveur
const PORT = process.env.PORT || 5432;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});


/*
Problèmes:
Sous-taches, faire que ça vérifier le user
À faire:
3) Interface de gesƟon des uƟlisateurs
- Vous devez créer une page HTML avec un script JavaScript qui fournit une interface
permeƩant de :
o Créer un nouvel uƟlisateur
o Récupérer ou régénérer une nouvelle clé api.
- UƟlisez la foncƟon Fetch en JavaScript pour interagir avec les deux routes de gesƟon des
uƟlisateurs de votre api.
- Vous trouverez à l’annexe B un « wireframe » de la page à créer. Vous devez vous le
reproduire le plus fidèlement possible.
4)Doc (DO I even have time!?!?)

*/
