// api/index.js

const serverless = require('serverless-http');
const app = require('../app'); // Asegúrate de que la ruta sea correcta

module.exports = serverless(app);
