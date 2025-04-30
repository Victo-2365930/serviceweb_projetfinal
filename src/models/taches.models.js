import db from '../config/db.js';

const listerTachesUtilisateur = (utilisateurID, termine) =>{
    return new Promise((resolve, reject) => {

        const requete = 'SELECT titre FROM taches WHERE utilisateur_id = ? AND complete = ?';
        const params = [utilisateurID, termine];

        db.query(requete, params, (erreur, resultat) => {
            if(erreur){
                console.log(erreur)
                reject(erreur);
            }
            else{
                resolve(resultat);
            }
        })
    })
}




export {listerTachesUtilisateur}