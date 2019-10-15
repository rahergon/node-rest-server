require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const port = process.env.PORT;

app.get('/', function(req, res) {
    //res.send('hello world');
    res.json('hello world');
});
app.get('/usuario', function(req, res) {
    //res.send('hello world');
    res.json('get usuario');
});
app.post('/usuario', function(req, res) {
    //res.send('hello world');
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: "false",
            mensaje: "el nombre es necesario"
        });
    } else {
        res.json({
            persona: body
        });
    }

});
app.put('/usuario/:id', function(req, res) {
    //res.send('hello world');
    let id = req.params.id;
    res.json({
        id
    });
});
app.delete('/usuario', function(req, res) {
    //res.send('hello world');
    res.json('delete usuario');
});


app.listen(port, () => {
    console.log(`Escuchando en el puerto ${ port }`);
});