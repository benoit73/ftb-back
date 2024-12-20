const sql = require("../helper/sqlHelper");
const Docker = require('dockerode');
const chooseFreePort = require("../helper/chooseFreePort")
const Container = require("../entity/containerClass")
class Server {
    constructor({ id, serverName, idUser, idModpack, port, ram, nbJoueurs, volume, active}) {
        this.id = id;
        this.serverName = serverName;
        this.idUser = idUser;
        this.idModpack = idModpack;
        this.port = port;
        this.ram = ram;
        this.nbJoueurs = nbJoueurs;
        this.volume = volume;
        this.active = active;
    }

    async createServerMain()
    {
        const choosePortResult = await chooseFreePort.chooseFreePort();
        if (choosePortResult.success != true || Number.isInteger(choosePortResult.port) == false)
        {
            console.log('Impossible de choisir un port libre (serverClass.js).')
            return {success: false}
        }     
        this.port = choosePortResult.port

        const resultSql = await this.insertServerSql();
        if (resultSql.success == true)
        {
            const container = new Container
            let createServerDockerResult = await container.createServerDocker(this)
            if (createServerDockerResult.success != true)
            {
                console.log('Impossible de créer le server docker.')
                return {success: false}
            }
            return {success: true}
        }

        return {success:false}

    }

    async insertServerSql() {
        try {
            // Obtenir la valeur de @prochain_id
            const query1 = `SELECT AUTO_INCREMENT 
                            FROM INFORMATION_SCHEMA.TABLES
                            WHERE TABLE_SCHEMA = 'FTB'
                            AND TABLE_NAME = 'servers';`;
    
            const result1 = await sql.queryWithParams(query1);
            const prochain_id = result1.data[0].AUTO_INCREMENT + 1;
    
            const query2 = `INSERT INTO servers (serverName, userId, portNum, ram, volume, modpackId, nbJoueurs, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
    
            const aData = [
                this.serverName,
                this.idUser,
                this.port,
                this.ram,
                `${prochain_id}_volume`,
                this.idModpack,
                this.nbJoueurs,
                1
            ];
    
            const result = await sql.queryWithParams(query2, aData);
    
            return result;
        } catch (err) {
            console.error('Erreur lors de l\'insertion :', err);
            throw err;
        }
    }
    

   
    
}

module.exports = Server