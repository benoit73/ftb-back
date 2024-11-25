const Docker = require('dockerode');
const docker = new Docker(); // Utilise le socket Docker par défaut (/var/run/docker.sock)
const Modpack = require('../entity/modpackClass')

class Container 
{
    
    async createServerDocker(server)
    {   
        try {
            const modpack = new Modpack(server.idModpack)
            const initalizeModpack = await modpack.initialize()

            // Créer et démarrer le conteneur
            const docker = new Docker;
            const container = await docker.createContainer({
                Image: `itzg/minecraft-server:java${modpack.javaVersion}`,
                name: server.serverName,
                HostConfig: {
                    PortBindings: {
                        '25565/tcp': [{ HostPort: `${server.port}` }]
                    },
                    Binds: [`${server.volumeName}:/data`]
                },
                Env: [
                    `VERSION=${modpack.minecraftVersion}`,
                    'EULA=TRUE',
                    'TYPE=FTBA',
                    `FTB_MODPACK_ID=${server.idModpack}`,
                    `MEMORY=${server.ram}G`
                ]
            });
    
            await container.start();
            console.log(`Conteneur Minecraft démarré avec succès : ${server.serverName}`);
            return {success: true}
        } catch (err) {
            console.error('Erreur lors de la création ou du démarrage du conteneur :', err);
            return {success: false, error: err}
        }
    }

    async listContainersByNames(Names) {
        try 
        {
            const containers = await docker.listContainers({all: true, filters: {name: Names}});
            return containers.map(container => ({
                id: container.Id,
                name: container.Names[0].replace('/', ''), // Enlève le "/" du nom du conteneur
                image: container.Image,
                status: container.Status,
                state: container.State,
          }));
        } catch (error) {
          console.error('Erreur lors de la récupération des conteneurs :', error);
          throw error;
        }
    }

}

module.exports = Container