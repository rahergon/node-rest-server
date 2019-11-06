const express = require('express');

const app = express();

var rutas_usuario = require('./usuario');
app.use('/', rutas_usuario);
var rutas_login = require('./login');
app.use('/', rutas_login);
var rutas_categoria = require('./categoria');
app.use('/', rutas_categoria);
var rutas_producto = require('./producto');
app.use('/', rutas_producto);

module.exports = app;