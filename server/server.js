require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/usuario', function(_, res) {
    res.json('GET Usuario');
});

app.post('/usuario', function(req, res) {

    const body = req.body;

    if (body.nombre === undefined) {

        res.status(400).json({
            ok: false,
            mensaje: 'Es necesario introducir el campo nombre en el cuerpo de la petición'
        })

    } else {

        res.json({
            body
        });
    }
});

app.put('/usuario/:id', function(req, res) {

    const id = req.params.id;

    res.json({
        id
    });
});

app.delete('/usuario', function(_, res) {

    res.json('DELETE Usuario');
});

app.listen(process.env.PORT, () => console.log(`Escuchando en el puerto ${process.env.PORT}`));