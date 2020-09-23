require('./config/config');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('./routes/index'));

mongoose.connect(process.env.URL_MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }).then(() => console.log('MongoDB Online'))
    .catch((err) => console.log(err));

app.listen(process.env.PORT, () => console.log(`Escuchando en el puerto ${process.env.PORT}`));