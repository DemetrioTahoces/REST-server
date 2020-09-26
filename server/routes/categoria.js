const express = require('express');
const _ = require('underscore');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const app = express();

let Categoria = require('../models/categoria');

route = '/categoria';

// ===============================
// Muestra todas las categorias
// ===============================
app.get(route, verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    const condicion = {}

    Categoria.find(condicion, 'descripcion usuario')
        .populate('usuario', 'nombre email')
        .limit(limite)
        .skip(desde)
        .exec((error, categorias) => {

            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            return Categoria.countDocuments(condicion, (_, cuenta) => {
                res.json({
                    ok: true,
                    num: cuenta,
                    categorias
                });
            });
        });
});


// ===============================
// Muestra una categoria
// ===============================
app.get(route + "/:id", verificaToken, (req, res) => {

    const id = req.params.id;

    Categoria.findById(id, 'descripcion usuario')
        .populate('usuario', 'nombre email')
        .exec((error, categoria) => {

            if (error) {

                if (error.kind === 'ObjectId') {
                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'Categoría no encontrada'
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
                categoria
            });
        });
});


// ===============================
// Crea una categoria
// ===============================
app.post(route, verificaToken, (req, res) => {

    let body = req.body;

    const categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((error, categoriaDB) => {

        if (error) {

            return res.status(400).json({
                ok: false,
                error
            });
        }

        return res.status(201).json({
            ok: true,
            categoria: _.pick(categoriaDB, ['_id', 'descripcion', "usuario"])
        });
    });
});


// ===============================
// Actualiza una categoria
// ===============================
app.put(route + "/:id", verificaToken, (req, res) => {

    const id = req.params.id;
    const body = _.pick(req.body, ['descripcion']);
    const options = {
        new: true,
        runValidators: true,
        context: 'query'
    }

    Categoria.findByIdAndUpdate(id, body, options)
        .populate('usuario', 'nombre email')
        .exec((error, categoriaDB) => {

            if (error) {

                if (error.kind === 'ObjectId') {

                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'Categoría no encontrada'
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
                categoria: _.pick(categoriaDB, ['_id', 'descripcion', "usuario"])
            });
        });
});


// ===============================
// Elimina una categoria (admin)
// ===============================
app.delete(route + "/:id", [verificaToken, verificaAdminRole], (req, res) => {

    id = req.params.id;

    Categoria.findByIdAndRemove(id)
        .populate('usuario', 'nombre email')
        .exec((error, categoriaBorrada) => {

            if (error) {

                if (error.kind === 'ObjectId') {

                    return res.status(404).json({
                        ok: false,
                        error: {
                            message: 'Categoría no encontrada'
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
                categoria: _.pick(categoriaBorrada, ['_id', 'descripcion', "usuario"]),
                message: 'Categoria Eliminada'
            });
        });
});

module.exports = app;