const mysql = require('mysql2/promise');

// Créer une fonction pour la connexion à la base de données
async function createConnection() {
    return await mysql.createConnection({
        host: process.env.BDD_URL,
        port: process.env.BDD_PORT,
        user: process.env.BDD_USER,
        password: process.env.BDD_PASSWORD,
        database: process.env.BDD_BDDNAME,
    });
}

// Fonction pour exécuter une requête SQL
async function queryWithParams(strQuery, aData = false) {
    const aReturn = { success: false }; // Utilisation de booléens pour 'success'
    try {
        const connection = await createConnection();
        console.log('Connexion établie');

        const [data] = await connection.execute(strQuery, aData);
        aReturn.success = true;
        aReturn.data = data;
        await connection.end(); // Fermer la connexion après chaque requête
    } catch (err) {
        console.error("Erreur SQL :", err);
        aReturn.error = err.message; // Ajout d'un message d'erreur dans le retour
    }
    return aReturn;
}

module.exports = {
    queryWithParams
};
