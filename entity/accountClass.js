const sql = require("../helper/sqlHelper");
const hashStr = require("../helper/hasherHelper");

class Account {
    constructor(email, password) {
        this.email = email;
        this.password = hashStr.hashString(password);
    }

    async createAccount() {
        const isAccount = await this.checkIfAccountExists(); 
        if (isAccount.success !== true) {
            return isAccount; // Retourne le message d'erreur si un compte existe déjà
        }
        
        const query = "INSERT INTO users (email, password) VALUES (?, ?)";
        const result = await sql.queryWithParams(query, [this.email, this.password]);
        return { success: true, data: result }; // Retourne le résultat avec succès
    }

    async checkIfAccountExists() {
        const query = "SELECT email FROM users WHERE email = ?";
        try {
            const result = await sql.queryWithParams(query, [this.email]);
            if (result && result.data.length === 0) {
                return { success: true }; // Le compte n'existe pas
            } else {
                return { success: false, errorMsg: 'Un compte associé à cette adresse email existe déjà.' };
            }
        } catch (err) {
            console.error("Erreur lors de la vérification du compte:", err);
            return { success: false, errorMsg: 'Erreur lors de la vérification du compte.' };
        }
    }
    
    async checkCredentials() {
        const query = "SELECT id FROM users WHERE email = ? AND password = ?";
        const aData = [this.email, this.password];
        
        const result = await sql.queryWithParams(query, aData);

        if (result.success && result.data.length > 0) {
            return { success: true, data: result.data };
        } else {
            return { success: false, errorMsg: "Votre email ou mot de passe est incorrect." };
        }
    }
}

module.exports = Account;
