const path = require('path');
const cookieParser = require('cookie-parser');
const express = require('express');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const hostname = 'localhost'
const port = '3000'


// Middleware pour analyser les données JSON
app.use(express.json());

// Utilise le middleware pour parser les cookies
app.use(cookieParser()); 

// Importer les routes
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');
const modpacksRoute = require('./routes/modPacks');
const createServerRoute = require('./routes/createServer');
const getServersRoute = require('./routes/getServers');

// Utiliser les routes avec un chemin de base
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/modpacks', modpacksRoute);
app.use('/createServer', createServerRoute);
app.use('/getServers', getServersRoute);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
