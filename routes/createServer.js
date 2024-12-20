const express = require('express');
const router = express.Router();
const checkUser = require('../helper/checkUser');
const Server = require('../entity/serverClass');

router.post('/', async (req, res) => {
    const data = req.body;
    const cookie = req.cookies.jwt;

    // Vérification du JWT
    const checkUserResult = checkUser.decodeJwt(cookie);
    if (!checkUserResult.success) {
        console.log("L'utilisateur n'a pas pu être identifié via le jwt");
        return res.status(401).json({ success: false, error: "Utilisateur non authentifié." });
    }

    const idUser = checkUserResult.userId;
    const { idModpack, nbJoueurs, serverName } = data;

    // Validation des données
    if (!idModpack || !nbJoueurs || !serverName) {
        return res.status(400).json({ success: false, error: "Données invalides ou manquantes." });
    }

    console.log('Dans createServer.js');
    const server = new Server({
        idUser: idUser,
        idModpack: idModpack,
        id: null,
        serverName: serverName,
        port: null,
        ram: 4,
        nbJoueurs: nbJoueurs,
        volume: null,
        active: true,
    });

    try {
        const result = await server.createServerMain();
        if (result.success) {
            return res.json({ success: true });
        }
        return res.status(500).json({ success: false, error: "Échec de la création du serveur." });
    } catch (err) {
        console.error("Erreur lors de la création du serveur :", err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
