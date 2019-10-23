const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/autentificacion');

const app = express();

app.get('/usuario', verificaToken, (req, res) => {

    //console.log(req.usuario); //viene del middleware verificaToken

    //parametros opcionales se mandan con un ? ejem: /usuario?desde=10&limite=10
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });
            /* count se va a dejar de usar se cambio por countDocuments
            Usuario.count({ estado: true }, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });
            */


        });

});
app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {
    //res.send('hello world');
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role

    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //usuarioDB.password = null;

        res.status(200).json({
            ok: true,
            usuario: usuarioDB
        });

    });
});
app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    //res.send('hello world');
    let id = req.params.id;
    //let body = req.body;
    //seleccionar los campos necesarios del objeto
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioDB
        });
    });
    /*
    res.json({
        id
    });
    */
});
app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {

    const id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true, runValidators: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "usuario no encontrado"
                }
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

    /*
    Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "usuario no encontrado"
                }
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
    */
});

module.exports = app;