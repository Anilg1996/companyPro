const express = require('express');
const mongoose = require('mongoose');
const route = require("./route")
const app = express();

app.use(express.json());

mongoose.connect("mongodb+srv://madhusmita_123:5fiVrKsOKBIGJsKe@cluster0.cpbhduk.mongodb.net/companyPro"
    , { useNewUrlParser: true })
    .then(() => console.log('mongodb is connected'))
    .catch(err => console.log(err))

app.use('/', route);

app.listen(3000, function () {
    console.log('App running on port')
});
