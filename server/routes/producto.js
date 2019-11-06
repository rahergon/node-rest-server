const express = require('express');

const Producto = require('../models/producto');

const { verificaToken, verificaAdminRole } = require('../middlewares/autentificacion');

const app = express();

// ==============================
// Crear un nuevo producto
// ==============================

app.post('/productos/agregar', [verificaToken, verificaAdminRole], (req, res) => {
    let id_usuario = req.usuario._id;

    let producto = new Producto({
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        categoria: req.body.categoria,
        usuario: id_usuario
    });

    producto.save((error, productoDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                error
            });
        }
        res.status(201).json({
            ok: true,
            categoria: productoDB
        });
    });
});

// ==============================
// obtener un producto
// ==============================

app.get('/productos/:id', (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((error, productoDB) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }
            res.status(200).json({
                ok: true,
                message: 'Producto encontrado',
                producto: productoDB
            })
        });
});

// ==============================
// Obtener todos los productos
// ==============================

app.get('/productos', (req, res) => {
    //parametros opcionales se mandan con un ? ejem: /usuario?desde=10&limite=10
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);



    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((error, productosBD) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }
            Producto.countDocuments({}, (error, conteo) => {
                res.status(200).json({
                    ok: true,
                    productosBD,
                    cuantos: conteo
                });
            });
        });
});

// ==============================
// Buscar productos
// ==============================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex, disponible: true })
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre descripcion')
        .exec((error, productosBD) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }
            res.status(200).json({
                ok: true,
                productosBD
            });

        });

});

// ==============================
// Modificar un producto
// ==============================

app.put('/productos/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let identificador = req.params.id;

    let body = req.body;

    Producto.findById(identificador, (error, productoDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                message: 'El producto no existe'
            });
        }

        Producto.findByIdAndUpdate(identificador, body, { new: true, runValidators: true }, (error, productoDB) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }
            res.status(200).json({
                ok: true,
                productoDB
            });
        });

    });


});

// ==============================
// Eliminar un producto cambiar disponibilidad
// ==============================
app.delete('/productos/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let identificador = req.params.id;

    Producto.findById(identificador, (error, productoDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'No existe el producto'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((error, productoBorrado) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }
            res.status(200).json({
                ok: true,
                productoBorrado,
                message: 'producto borrado'
            });

        });


    });
    /*
        Producto.findByIdAndUpdate(identificador, { disponible: false }, (error, productoDB) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }
            res.status(200).json({
                ok: true,
                productoDB
            });
        });
        */
});

module.exports = app;