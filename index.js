import express from 'express';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

const app = express();
const swaggerDocument = JSON.parse(fs.readFileSync('./src/config/documentation.json', 'utf8'));
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Demo API"
};

/*
Accepter les requetes de localhost 
Seulement dans le cadre du travail
*/
app.use(cors({
  origin: 'http://localhost'
}));

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// Importer les routes
import methoderoutes from './src/routes/taches.routes.js';
app.use('/', methoderoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

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

1)Doc (DO I even have time!?!?)

*/
