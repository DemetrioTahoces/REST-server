const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')
const app = express();

const route = '/usuario';

app.get(route, verificaToken, (req, res) => {

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

                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            return Usuario.countDocuments(condicion, (_, cuenta) => {
                res.json({
                    ok: true,
                    num: cuenta,
                    usuarios
                });
            });
        });
});

app.post(route, [verificaToken, verificaAdminRole], function(req, res) {

    const body = req.body;

    const usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((error, usuarioDB) => {

        if (error) {

            return res.status(400).json({
                ok: false,
                error
            });
        }

        return res.status(201).json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put(`${route}/:id`, [verificaToken, verificaAdminRole], function(req, res) {

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

                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'Usuario no encontrado'
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
            usuario: usuarioDB
        });
    });
});

app.delete(`${route}/:id`, [verificaToken, verificaAdminRole], function(req, res) {

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

                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'Usuario no encontrado'
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
            usuario: usuarioDB,
            message: 'Usuario Eliminado'
        });
    });
});

module.exports = app