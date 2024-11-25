const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function decodeJwt(token)
{
    const decoded = jwt.verify(token, JWT_SECRET)

    const exp = decoded.exp
    const iat = decoded.iat
    const userId = decoded.userId

    var now = Date.now() / 1000

    if (now < exp && Number.isInteger(userId))
    {
        return {success: true, userId: userId}
    }
    return {success: false, idUser: userId}
}

module.exports = { decodeJwt };
