const express = require('express');
const router = express.Router();
const Container = require('../entity/containerClass');

router.post('/', async (req, res) => {
    try 
    {
        const data = req.body;
        const action = data.action;
        const server = data.serveur;
        const myContainer = new Container();
        const result = await myContainer.actionOnContainer(server, action);
        res.send({success: result.success});
    }
    catch
    {
        res.send({success: false});
    }
});

module.exports = router;
