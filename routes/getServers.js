const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const checkUser = require('../helper/checkUser')
const { exec } = require('child_process');
const sql = require('../helper/sqlHelper');
const Server = require('../entity/serverClass');
const Container = require('../entity/containerClass')

router.get('/', async (req, res) => {
    const data = req.body;
    const cookie = req.cookies.jwt
    const checkUserResult = checkUser.decodeJwt(cookie)
    const idUser = checkUserResult.userId;
    const container = new Container;
    let result = [];
    if (idUser && Number.isInteger(idUser))
    {
        const servers = await getServersSqlByIdUser(idUser);
        const containersNames = [];

        servers.forEach(element => {
            containersNames.push(element.serverName)
        })

        if (containersNames && containersNames.length > 0)
        {
            const containers = await container.listContainersByNames(containersNames);
            const mergedList = [
                ...containers.map(item1 => {
                  const match = servers.find(item2 => item2.serverName === item1.name);
                  return match ? { ...item1, ...match } : item1;
                }),
                ...servers.filter(item2 => !containers.some(item1 => item1.name === item2.serverName))
              ];
            
            mergedList.forEach(element => 
            {
                // Traduction de "state"
                switch (element.state) 
                {
                    case 'running':
                        element.state = 'Démarré';
                        break;
            
                    case 'exited':
                        element.state = 'Arrêté';
                        break;
                    
                    case 'paused':
                        element.state = 'En pause';
                        break;
            
                }
            
                if (element.status)
                {
                    if (element.status.includes('(unhealthy)')) {
                        element.status = 'Mauvais état';
                    } 
                    else if (element.status.includes('(healthy)')) {
                        element.status = 'En forme';
                    } 
                    else if (element.status.includes('Exited')) {
                        element.status = 'Arrêté';
                    } 
                    else if (element.status.includes('Paused')) {
                        element.status = 'En pause';
                    } 
                }
    
            });
            result = mergedList;
        }

        res.send({success: true, data:result})
    }
})

async function getServersSqlByIdUser(idUser)
{
    try{
        const query = `SELECT servers.*, modpacks.name as modpackName FROM servers JOIN modpacks on modpacks.idModpack = servers.modpackId WHERE userId = ?`;
        const data = [idUser];
        const result = await sql.queryWithParams(query, data);
        const resultData = result.data;

        return resultData
    }
    catch(err)
    {
        console.log('error sql : ' + err)
    }
}

module.exports = router;
