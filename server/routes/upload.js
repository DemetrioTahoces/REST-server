const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const { verificaToken, verificaTokenImg } = require('../middlewares/autenticacion');
const app = express();

//Subir Archivos
app.use(fileUpload({
    useTempFiles: true
}));

route = '/imagen';

const extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

const usuarioString = 'usuario';
const productoString = 'producto';
const tiposValidos = [usuarioString, productoString];

app.get(`${route}/:tipo/:img`, verificaTokenImg, (req, res) => {

    const tipo = req.params.tipo;
    const img = req.params.img;

    const pathImg = path.resolve(__dirname, `../../uploads/${tipo}s/${img}`);

    if (fs.existsSync(pathImg)) {

        res.sendFile(pathImg);

    } else {

        const noImagesPath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagesPath);
    }
});

app.put(`${route}/:tipo/:id`, verificaToken, (req, res) => {

    const id = req.params.id;
    const tipo = req.params.tipo;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No files were uploaded'
        });
    }

    const archivo = req.files.archivo;
    const nombreSplit = archivo.name.split('.');
    const extension = nombreSplit[nombreSplit.length - 1];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Extension no permitida',
            extensionesValidas
        });
    }

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Tipo no permitido',
            tiposValidos
        });
    }

    const nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    archivo.mv(`uploads/${tipo}s/${nombreArchivo}`, (error) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        // La imagen ya esta en uploads

        if (tipo === usuarioString) {

            imagenUsuario(id, res, nombreArchivo);

        } else if (tipo === productoString) {

            imagenProducto(id, res, nombreArchivo);

        } else {

            return res.status(400).json({
                ok: false,
                message: 'Tipo no permitido',
                tiposValidos
            });
        }
    });
});

const imagenUsuario = (id, res, nombreArchivo) => {

    Usuario.findById(id, (error, usuarioDB) => {

        borraArchivo(usuarioDB.img, usuarioString);

        if (error) {

            if (error.kind === 'ObjectId') {
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'Usuario no encontrado'
                    }
                });
            }

            return res.status(500).json({
                ok: false,
                error
            });
        }

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((error, usuarioGuardado) => {

            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            return res.json({
                ok: true,
                usuario: usuarioGuardado,
                message: 'Imagen de usuario subida correctamente',
                img: nombreArchivo
            });
        });
    });
}

const imagenProducto = (id, res, nombreArchivo) => {

    Producto.findById(id, (error, productoDB) => {

        borraArchivo(productoDB.img, productoString);

        if (error) {

            if (error.kind === 'ObjectId') {
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: 'Producto no encontrado'
                    }
                });
            }
            return res.status(500).json({
                ok: false,
                error
            });
        }

        productoDB.img = nombreArchivo;

        productoDB.save((error, productoGuardado) => {

            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }
            return res.json({
                ok: true,
                producto: productoGuardado,
                message: 'Imagen de producto subida correctamente',
                img: nombreArchivo
            });
        });
    });
}

const borraArchivo = (nombreImagen, tipo) => {

    const pathImagen = path.resolve(__dirname, `../../uploads/${tipo}s/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;