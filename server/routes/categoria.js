const express = require('express');

const Categoria = require('../models/categoria');

const { verificaToken, verificaAdminRole } = require('../middlewares/autentificacion');

const app = express();

// ==============================
// Mostrar todas las categorias
// ==============================

app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({}, 'descripcion')
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((error, categorias) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }
            Categoria.countDocuments({}, (error, conteo) => {
                res.status(200).json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                });
            });
        });
});

// ==============================
// Mostrar una categoria
// ==============================

app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id)
        .exec((error, categoria) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }
            res.status(200).json({
                ok: true,
                categoria
            });
        });
});

// ==============================
// Crear una nueva categoria
// ==============================
app.post('/categoria/agregar', [verificaToken, verificaAdminRole], (req, res) => {
    let identificador = req.usuario._id;

    let categoria = new Categoria({
        descripcion: req.body.descripcion,
        usuario: identificador
    });

    categoria.save((error, categoriaDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        res.status(200).json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

// ==============================
// Modificar una categoria
// ==============================

app.put('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let identificador = req.params.id;

    let body = req.body;

    Categoria.findByIdAndUpdate(identificador, body, { new: true }, (error, categoriaDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        res.status(200).json({
            ok: true,
            categoria: categoriaDB
        });
    });


});

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let identificador = req.params.id;

    Categoria.findByIdAndDelete(identificador, (error, categoriaDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "categoria no encontrada"
                }
            });
        }
        res.status(200).json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

module.exports = app;