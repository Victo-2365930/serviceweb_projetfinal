
//Fonction pour créer un utilisateur
document.addEventListener("DOMContentLoaded", () => {
    const BoutonCreer = document.getElementById("boutonCreer");
  
    BoutonCreer.addEventListener("click", (event) => {
      event.preventDefault();
  
      const url = "https://service-web-api.onrender.com/utilisateurs";
      const prenom = document.getElementById("prenom").value;
      const nom = document.getElementById("nom").value;
      const courriel = document.getElementById("courriel").value;
      const motdepasse = document.getElementById("motdepasse").value;
      const divcleapi = document.getElementById("bas");
      const cleapiField = document.getElementById("cle_api"); 
  
      if (prenom !== "" && nom !== "" && courriel !== "" && motdepasse !== "") { 
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prenom: prenom,
            nom: nom,
            courriel: courriel,
            password: motdepasse,
          }),
        };
  
        fetch(url, options)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            cleapiField.value = data.cle_api;
            divcleapi.classList.remove("invisible");
          })
          .catch((error) => {
            console.error("Erreur lors de la requête:", error);
          });
      } else {
        alert("Tous les champs sont obligatoires.");
      }
    });
  });
  
//Fonction pour récupérer la clé API
  document.addEventListener("DOMContentLoaded", () => {
    const BoutonRecuperer = document.getElementById("boutonRecuperer");
  
    BoutonRecuperer.addEventListener("click", (event) => {
      event.preventDefault();
  
      const url = "https://service-web-api.onrender.com/cle-api";
      const courrielcle = document.getElementById("courriel-cle").value;
      const motdepassecle = document.getElementById("motdepasse-cle").value;
      const generer = document.getElementById("generer").checked;
      const divcleapi = document.getElementById("bas");
      const cleapiField = document.getElementById("cle_api");
  
      if (courrielcle !== "" && motdepassecle !== "") {
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courriel: courrielcle,
            password: motdepassecle,
            regen: generer
          }),
        };
  
        fetch(url, options)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            cleapiField.value = data.cle_api;
            divcleapi.classList.remove("invisible");
          })
          .catch((error) => {
            console.error("Erreur lors de la requête:", error);
          });
      } else {
        alert("Tous les champs sont obligatoires.");
      }
    });
  });
  