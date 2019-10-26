require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); //no se debe instalar con npm es un paquete de node

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));
//console.log(path.resolve(__dirname, '../public'));

//Configuración global de rutas
app.use('/', require('./routes/index'));

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