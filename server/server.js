require('./config/config');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');

const app = express();
//Parsea www.urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//Parsea Json
app.use(bodyParser.json());
//servicios
app.use(require('./routes/index'));

//Habilitar carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

mongoose.connect(process.env.URL_MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }).then(() => console.log('MongoDB Online'))
    .catch((err) => console.log(err));

app.listen(process.env.PORT, () => console.log(`Escuchando en el puerto ${process.env.PORT}`));