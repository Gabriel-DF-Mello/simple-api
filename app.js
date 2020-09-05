require("dotenv/config");

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { verify } = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");
const {createAccessToken, 
    createRefreshToken, 
    sendAccessToken, 
    sendRefreshToken
} = require("./tokens")

const rt_usuarios = require("./routes/usuarios");
const rt_pagamentos = require("./routes/pagamentos");
const rt_recebimentos = require("./routes/recebimentos")
const mysqlCon = require("./connection")
const {isAuth, isAdmin} = require("./isAuth")


const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use("/usuarios", rt_usuarios);
app.use("/pagamentos", rt_pagamentos);
app.use("/recebimentos", rt_recebimentos)
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true
    })
);

app.get("/", (req, res)=>{
    res.send("Hello World!");
});

app.post("/login", (req, res)=>{
    if(req.body && req.body.email && req.body.senha){
        const email = req.body.email;
        const password = req.body.senha;

        try{
            mysqlCon.query(`SELECT * FROM usuarios WHERE email='${email}'`,(err, rows, fields)=>{
                if(!err)
                {
                    //console.log(rows);
                    if(rows.length <= 0) res.send({error: `O usuário não existe`});
                    
                    // Comparando a senha no banco com o valor inserido
                    compare(password, rows[0].senha, (err, valid)=>{
                        if(!err){
                            if (!valid) res.send({error: `Senha incorreta`});
                            // Criar tokens
                            const accesstoken = createAccessToken(rows[0].id, rows[0].permit)
                            const refreshtoken = createRefreshToken(rows[0].id, rows[0].permit)

                            // Envia tokens
                            sendRefreshToken(res, refreshtoken);
                            sendAccessToken(res, req, accesstoken);
                        }else{
                            res.send({
                                error: `Houve um erro na validação.`
                            })
                        }
                    });
                }else{
                    res.send({
                        error: `Ocorreu um erro.`
                    })
                }
            });
        }catch(err){
            res.send({
                error: `${err.message}`
            })
        }
    }
});

app.post("/logout", (_req, res) => {
    res.clearCookie("refreshtoken");
    return res.send({
        message: "Você saiu do sistema."
    })
});

app.post("/protected", async(req, res)=>{
    try{
        const userId = isAuth(req);
        if(userId !== null){
            res.send({
                data: `Informações protegidas`
            })
        }
    }catch(err){
        res.send({
            error: `${err.message}`
        })
    }
})

app.post("/admin", async(req, res)=>{
    try{
        const userId = isAdmin(req);
        if(userId !== null){
            res.send({
                data: `Informações de administrador`
            })
        }
    }catch(err){
        res.send({
            error: `${err.message}`
        })
    }
})

// TODO: change all routes to protected routes

app.listen(process.env.PORT);