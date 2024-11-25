const sql = require('../helper/sqlHelper');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const modPacks = await getModPacks();
        res.send({ success: true, data: modPacks });
    } 
    catch (error) {
        console.error(error);
        res.status(500).send({ success: false, error: 'Internal Server Error' });
    }
});





async function getModPacks()
{
    const query = "SELECT * FROM modpacks";
    const modPacks = sql.queryWithParams(query);
    return modPacks;
}

module.exports = router;
