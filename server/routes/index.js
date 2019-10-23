const express = require('express');

const app = express();

var rutas_usuario = require('./usuario');
app.use('/', rutas_usuario);
var rutas_login = require('./login');
app.use('/', rutas_login);

module.exports = app;