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
const rt_relatorios = require("./routes/relatorios")
const mysqlCon = require("./connection")
const {isAuth, isAdmin} = require("./isAuth")


const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use("/usuarios", rt_usuarios);
app.use("/pagamentos", rt_pagamentos);
app.use("/recebimentos", rt_recebimentos);
app.use("/relatorios", rt_relatorios);
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true
    })
);

app.post("/login", (req, res)=>{
    if(req.body && req.body.email && req.body.senha){
        const email = req.body.email;
        const password = req.body.senha;

        try{
            mysqlCon.query(`SELECT * FROM usuarios WHERE email='${email}'`,(err, rows, fields)=>{
                if(!err)
                {
                    //console.log(rows);
                    if(rows.length <= 0) return res.send({error: `O usuário não existe`});
                    
                    // Comparando a senha no banco com o valor inserido
                    compare(password, rows[0].senha, (err, valid)=>{
                        if(!err){
                            if (!valid) return res.send({error: `Senha incorreta`});
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
    res.clearCookie("refreshtoken", {path: "/refresh_token"});
    return res.send({
        message: "Você está fora do sistema."
    })
});

app.post("/refresh_token", (req, res)=>{
    const token = req.cookies.refreshtoken;

    //Caso não haja um token na req
    if(!token) return res.send({
        accesstoken:""
    });

    let payload = null;
    try{
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
    }catch(err){
        return res.send({
            accesstoken:""
        });
    }

    mysqlCon.query(`SELECT * FROM usuarios WHERE id='${payload.id}'`,(err, rows, fields)=>{
        if(err) res.send({accesstoken:""});
        if(rows.length <= 0) res.send({accesstoken:""});

        // Criar tokens
        const accesstoken = createAccessToken(rows[0].id, rows[0].permit)
        const refreshtoken = createRefreshToken(rows[0].id, rows[0].permit)

        // Envia tokens
        sendRefreshToken(res, refreshtoken);
        sendAccessToken(res, req, accesstoken);
    });
})

app.listen(process.env.PORT);