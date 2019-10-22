require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

/*
app.use('./routes/usuario.js', function(err, req, res, next) {
    console.log(err);
});
*/

var rutas_usuario = require('./routes/usuario');
app.use('/', rutas_usuario);

const port = process.env.PORT;
const urldb = process.env.URLDB;



mongoose.connect(urldb, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) throw err;

    console.log('Base de datos online');
});

/*
mongoose.connect('mongodb://localhost:27017/cafe', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) throw err;

    console.log('Base de datos online');
});
*/

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${ port }`);
});