const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const checkUser = require('../helper/checkUser')
const { exec } = require('child_process');
const sql = require('../helper/sqlHelper');
const Server = require('../entity/serverClass');

router.post('/', async (req, res) => {
    const data = req.body;
    const cookie = req.cookies.jwt
    const checkUserResult = checkUser.decodeJwt(cookie)
    const idUser = checkUserResult.userId;
    const idModpack = data.idModpack
    const nbJoueurs = data.nbJoueurs
    const serverName = data.serverName
    
    if (checkUserResult.success == true)
    {
        let server = new Server({
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
        try
        {
            const result = server.createServerMain();
            if (result.success == true)
            {
                return {success: true}
            }
            return {success: false}
        }
        catch(err)
        {
            return {success: false, error: err}
        }

    }

});




module.exports = router;
