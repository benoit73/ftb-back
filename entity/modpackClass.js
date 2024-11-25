const sql = require('../helper/sqlHelper');

class Modpack {
    constructor(id) {
        this.id = id;
        this.name = null;
        this.minecraftVersion = null;
        this.urlImg = null;
        this.javaVersion = null;
    }

    async initialize() {
        try {
            const query = `SELECT * FROM modpacks WHERE idModpack = ?`;
            const data = [this.id];
            const result = await sql.queryWithParams(query, data);

            if (result.data && result.data[0]) {
                this.name = result.data[0].name; // Assurez-vous que le nom de colonne est correct
                this.minecraftVersion = result.data[0].minecraftVersion;
                this.urlImg = result.data[0].urlImg;
                this.javaVersion = result.data[0].javaVersion;
                return { success: true };
            }
            return { success: false, message: 'Modpack not found' };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

}

module.exports = Modpack;
