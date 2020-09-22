const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const app = express();

const route = '/usuario';

app.get(route, function(req, res) {

    const condicion = {
        estado: true
    }

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find(condicion, 'nombre email role estado google')
        .limit(limite)
        .skip(desde)
        .exec((error, usuarios) => {

            if (error) {

                res.status(400).json({
                    ok: false,
                    error
                });

            } else {

                Usuario.countDocuments(condicion, (_, cuenta) => {
                    res.json({
                        ok: true,
                        num: cuenta,
                        usuarios
                    });
                });
            }
        });
});

app.post(route, function(req, res) {

    const body = req.body;

    const usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((error, usuarioDB) => {

        if (error) {

            res.status(400).json({
                ok: false,
                error
            });

        } else {

            res.json({
                ok: true,
                usuario: usuarioDB
            });
        }
    });
});

app.put(`${route}/:id`, function(req, res) {

    const id = req.params.id;
    const body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    const options = {
        new: true,
        runValidators: true,
        context: 'query'
    }

    Usuario.findByIdAndUpdate(id, body, options, (error, usuarioDB) => {

        if (error) {

            if (error.kind === 'ObjectId') {

                res.status(404).json({
                    ok: false,
                    error: {
                        message: 'Usuario no encontrado'
                    }
                });

            } else {

                res.status(400).json({
                    ok: false,
                    error
                });
            }

        } else {

            res.json({
                ok: true,
                usuario: usuarioDB
            });

        }
    });
});

app.delete(`${route}/:id`, function(req, res) {

    const id = req.params.id;

    const body = {
        estado: false
    }

    const options = {
        new: true
    }

    Usuario.findByIdAndUpdate(id, body, options, (error, usuarioDB) => {

        if (error) {

            if (error.kind === 'ObjectId') {

                res.status(404).json({
                    ok: false,
                    error: {
                        message: 'Usuario no encontrado'
                    }
                });

            } else {

                res.status(400).json({
                    ok: false,
                    error
                });
            }

        } else {

            res.json({
                ok: true,
                usuario: usuarioDB
            });
        }
    });

    /*
    Usuario.findByIdAndRemove(id, (error, usuarioBorrado) => {

        if (error) {

            if (error.kind === 'ObjectId') {

                res.status(404).json({
                    ok: false,
                    error: {
                        message: 'Usuario no encontrado'
                    }
                });

            } else {

                res.status(400).json({
                    ok: false,
                    error
                });
            }

        } else {

            res.json({
                ok: true,
                usuario: usuarioBorrado
            });
        }
    });
    */
});

module.exports = app