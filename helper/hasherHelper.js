const crypto = require('crypto');

function hashString(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

module.exports = { hashString };
