const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const app = express();
const client = new OAuth2Client(process.env.CLIENT_ID);

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
});

//Configuracion de Google
async function verify(token) {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });

    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', (req, res) => {

    const token = req.body.idtoken;

    verify(token).then(googleUser => {

        const query = {
            email: googleUser.email
        }

        Usuario.findOne(query, (error, usuarioDB) => {

            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            if (usuarioDB) {

                if (usuarioDB.google === false) {
                    return res.status(400).json({
                        ok: false,
                        error: {
                            message: 'Debe usar su autenticación normal'
                        }
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {
                    expiresIn: process.env.TOKEN_TIME
                })

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }

            // El usuario aún no existe en BBDD

            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((error, usuarioDB) => {

                if (error) {
                    return res.status(500).json({
                        ok: false,
                        error
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {
                    expiresIn: process.env.TOKEN_TIME
                })

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            });
        });

    }).catch(error => {
        return res.status(403).json({
            ok: false,
            error
        });
    });
});

module.exports = app;