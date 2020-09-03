const express = require("express");
const bodyParser = require("body-parser");

const rt_usuarios = require("./routes/usuarios");
const rt_pagamentos = require("./routes/pagamentos");
const rt_recebimentos = require("./routes/recebimentos")

const port = 3000;


const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use("/usuarios", rt_usuarios);
app.use("/pagamentos", rt_pagamentos);


app.get("/", (req, res)=>{
    res.send("Hello World!");
});

app.listen(port);