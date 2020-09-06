const express = require("express");
const mysqlCon = require("../connection");
const {isAuth, isAdmin} = require("../isAuth")

const router = express.Router();

router.get("/", async(req, res)=>{
    // Seleciona toda a informação dos pagamentos
    try{
        const userId = isAuth(req);
        if(userId !== null){
            mysqlCon.query("SELECT * FROM pagamentos", (err, rows, fields)=>{
                if(!err)
                {
                    res.send(rows);
                }else
                {
                    console.log(err)
                }
            });
        }
    }catch(err){
        res.send({
            error: `${err.message}`
        })
    }
});

router.post("/", async(req, res)=>{
    try{
        const userId = isAdmin(req);
        if(userId !== null){
            // Confere se a req possui todos os campos necessários para uma inserção
            if(req.body && req.body.valor && req.body.data_p && req.body.realizado){
                const valor = req.body.valor
                const data = req.body.data_p
                const realizado = req.body.realizado;
                mysqlCon.query(`INSERT INTO pagamentos VALUES(null, ${valor}, '${data}', ${realizado})`, (err, rows, fields)=>{
                    if(!err)
                    {
                        res.send(rows);
                    }else
                    {
                        console.log(err)
                    }
                });
            }
        }
    }catch(err){
        res.send({
            error: `${err.message}`
        })
    }
});

router.delete('/:id', async(req, res) =>{
    try{
        const userId = isAdmin(req);
        if(userId !== null){
            mysqlCon.query('DELETE FROM pagamentos WHERE id=' + parseInt(req.params.id),(err, rows, fields)=>{
                if(!err)
                {
                    res.send(rows);
                }else
                {
                    console.log(err)
                }
            });
        }
    }catch(err){
        res.send({
            error: `${err.message}`
        })
    }
});

router.patch('/:id', async(req, res) =>{
    try{
        const userId = isAdmin(req);
        if(userId !== null){
            if(req.body && req.body.id && req.body.valor && req.body.data_p && req.body.realizado){
                const valor = req.body.valor
                const data = req.body.data_p
                const realizado = req.body.realizado;
        
                mysqlCon.query(`UPDATE pagamentos SET valor=${valor}, data_p='${data}', realizado=${realizado}, WHERE id=${id}`, (err, rows, fields)=>{
                    if(!err)
                    {
                        res.send(rows);
                    }else
                    {
                        console.log(err)
                    }
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