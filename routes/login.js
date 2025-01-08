const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const sql = require('../helper/sqlHelper');
const Account = require('../entity/accountClass.js');

const SECRET_KEY = process.env.JWT_SECRET;

// Route pour la connexion
router.post('/', async (req, res) => {
  const data = req.body;

  if (data.email && data.password) {
    const account = new Account(data.email, data.password);
    
    const checkCredentials = await account.checkCredentials(); 


    if (checkCredentials.success === true && checkCredentials.data.length === 1) {
      generateToken(res, checkCredentials.data[0].id); 
      res.send({ success: true, id: checkCredentials.data[0].id,})
    } 
    else {
      res.status(401).json({ success: false, errorMsg: 'Votre email ou mot de passe est incorrect.' });
    }
  } 
  else {
    res.status(400).json({ success: false, errorMsg: 'Veuillez fournir un email et un mot de passe.' });
  }
});




function generateToken(res, userId)
{
  const payload = { userId: userId };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h'});
  res.cookie('jwt', token, {maxAge: 4 * 60 * 60 * 1000, SameSite: 'lax'});
}


module.exports = router;
