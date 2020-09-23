const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const app = express();

const route = '/login';

app.post(route, (req, res) => {

    const body = req.body;
    const query = {
        email: body.email
    }

    Usuario.findOne(query, (error, usuarioDB) => {

        if (error) {

            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!usuarioDB) {

            return res.status(401).json({
                ok: false,
                error: {
                    message: "Usuario o contraseña incorrectos"
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {

            return res.status(401).json({
                ok: false,
                error: {
                    message: "Usuario o contraseña incorrectos"
                }
            });
        }

        const token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, {
            expiresIn: process.env.TOKEN_TIME
        });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    });
})

module.exports = app;