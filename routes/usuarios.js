const express = require("express");
const mysqlCon = require("../connection")
const { hash, compare } = require("bcryptjs");
const {isAuth, isAdmin} = require("../isAuth")

const router = express.Router();

router.get("/", async(req, res)=>{
    try{
        const userId = isAuth(req);
        if(userId !== null){
            // Seleciona toda a informação dos usuarios
            mysqlCon.query("SELECT * FROM usuarios", (err, rows, fields)=>{
                if(!err)
                {
                    res.send(rows);
                }else
                {
                    res.send({error: `${err.message}`})
                }
            });
        }
    }catch(err){
        res.send({
            error: `${err.message}`
        })
    }
});


// O cadastro foi liberado a qualquer utilizador da API sem necessidade de autenticação para facilitar o uso e teste
router.post("/registrar", async(req, res)=>{
    // Confere se a req possui todos os campos necessários para uma inserção
    if(req.body && req.body.nome && req.body.email && req.body.senha && req.body.permit){
        const nome = req.body.nome.substring(0,90);
        const email = req.body.email.substring(0,90);
        const senha = req.body.senha
        const permit = req.body.permit;

        try
        {
            mysqlCon.query(`SELECT * FROM usuarios WHERE email='${email}'`,(err, rows, fields)=>{
                if(err) return res.send({error: `${err.message}`});

                if(rows.length > 0) return res.send({message: "O usuário ja existe"});

                hash(senha, 10, (err, senhaHash)=>{
                    if(err) return res.send({error: `${err.message}`})

                    mysqlCon.query(`INSERT INTO usuarios VALUES(null, '${nome}', '${email}', '${senhaHash}', ${permit})`, (err, rows, fields)=>{
                        if(err) return res.send({error: `${err.message}`})

                        res.send(rows);
                    });
                });
            });
        }catch(error){
            res.send({error: error.message})
        }
    }
});


router.delete('/:id', async(req, res) =>{
    try{
        const userId = isAdmin(req);
        if(userId !== null){
            mysqlCon.query('DELETE FROM usuarios WHERE id=' + parseInt(req.params.id),(err, rows, fields)=>{
                if(!err)
                {
                    res.send(rows);
                }else
                {
                    res.send({error: `${err.message}`})
                }
            });
        }
    }catch(err){
        res.send({
            error: `${err.message}`
        })
    }
});

// O email foi propositalmente deixado de fora da edição do usuário
router.patch('/:id', async(req, res) =>{
    try{
        const userId = isAdmin(req);
        if(userId !== null){
            if(req.body && req.body.id && req.body.nome && req.body.senha && req.body.permit){
                const id = parseInt(req.params.id);
                const nome = req.body.nome.substring(0,90);
                const senha = req.body.senha
                const permit = req.body.permit;

                hash(senha, 10, (err, senhaHash)=>{
                    if(err) return res.send({error: `${err.message}`})

                    mysqlCon.query(`UPDATE usuarios SET nome='${nome}', senha='${senhaHash}', permit=${permit} WHERE id=${id}`, (err, rows, fields)=>{
                        if(!err)
                        {
                            res.send(rows);
                        }else
                        {
                            res.send({error: `${err.message}`})
                        }
                    });
                });
            }
        }
    }catch(err){
        res.send({
            error: `${err.message}`
        })
    }
});

module.exports = router;