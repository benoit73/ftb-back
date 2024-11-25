const express = require('express');
const router = express.Router();
const Account = require('../entity/accountClass.js');

// Route pour l'enregistrement
router.post('/', async (req, res) => {
  const data = req.body;
  console.log('recu!');
  // Vérifie si les champs ne sont pas vides
  if (!data.email || !data.password) {
    return res.status(400).json({ success: 'false', message: 'Email et mot de passe requis' });
  }

  // Création d'un compte
  const account = new Account(data.email, data.password);

  try {
    const result = await account.createAccount();
    res.status(200).json(result); // On renvoie le résultat de `createAccount`
  } catch (error) {
    console.error("Erreur lors de la création du compte :", error);
    res.status(500).json({ success: 'false', message: 'Erreur serveur' });
  }
});

module.exports = router;
