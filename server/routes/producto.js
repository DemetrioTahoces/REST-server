const express = require('express');
const _ = require('underscore');
const Producto = require('../models/producto');
const { verificaToken } = require('../middlewares/autenticacion')
const app = express();

const route = '/producto';

// ===============================
// Obtener productos
// ===============================
app.get(route, verificaToken, (req, res) => {

    const search = req.query.search;
    const regex = new RegExp(search, 'i');

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    const condicion = {
        disponible: true,
        nombre: regex
    }

    Producto.find(condicion, 'nombre precioUni descripcion disponible categoria usuario')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .limit(limite)
        .skip(desde)
        .exec((error, productos) => {

            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            return Producto.countDocuments(condicion, (_, cuenta) => {
                res.json({
                    ok: true,
                    num: cuenta,
                    productos
                });
            });
        });
});


// ===============================
// Obtener producto por ID
// ===============================
app.get(route + '/:id', verificaToken, (req, res) => {

    const id = req.params.id;

    Producto.findById(id, 'nombre precioUni descripcion disponible categoria usuario')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((error, producto) => {

            if (error) {

                if (error.kind === 'ObjectId') {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'Producto no encontrado'
                        }
                    });
                }

                return res.status(400).json({
                    ok: false,
                    error
                });
            }

            return res.json({
                ok: true,
                producto
            });
        });
});


// ===============================
// Crear un producto
// ===============================
app.post(route, verificaToken, (req, res) => {

    let body = req.body;

    const producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id,
        disponible: body.disponible
    });

    producto.save((error, productoDB) => {

        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        return res.status(201).json({
            ok: true,
            producto: _.pick(productoDB, ['_id', 'nombre', 'precioUni', 'descripcion', 'disponible', 'categoria', "usuario"])
        });
    });
});


// ===============================
// Actualizar un producto
// ===============================
app.put(route + '/:id', verificaToken, (req, res) => {

    const id = req.params.id;
    const body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible']);

    const options = {
        new: true,
        runValidators: true,
        context: 'query'
    }

    Producto.findByIdAndUpdate(id, body, options)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((error, productoDB) => {

            if (error) {

                if (error.kind === 'ObjectId') {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'Producto no encontrado'
                        }
                    });
                }

                return res.status(400).json({
                    ok: false,
                    error
                });
            }

            return res.json({
                ok: true,
                producto: _.pick(productoDB, ['_id', 'nombre', 'precioUni', 'descripcion', 'disponible', 'categoria', 'usuario'])
            });
        });
});


// ===============================
// Borrar un producto
// ===============================
app.delete(route + '/:id', verificaToken, (req, res) => {

    const id = req.params.id;

    const body = {
        disponible: false
    }

    const options = {
        new: true
    }

    Producto.findByIdAndUpdate(id, body, options)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((error, productoDB) => {

            if (error) {

                if (error.kind === 'ObjectId') {

                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'Producto no encontrado'
                        }
                    });
                }

                return res.status(400).json({
                    ok: false,
                    error
                });
            }

            return res.json({
                ok: true,
                producto: _.pick(productoDB, ['_id', 'nombre', 'precioUni', 'descripcion', 'disponible', 'categoria', 'usuario']),
                message: 'Produto Eliminado'
            });
        });
});


module.exports = app;