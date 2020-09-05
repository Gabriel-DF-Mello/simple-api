const express = require("express");
const mysqlCon = require("../connection")

const router = express.Router();

router.get("/", (req, res)=>{
    // Seleciona toda a informação dos recebimentos
    mysqlCon.query("SELECT * FROM recebimentos", (err, rows, fields)=>{
        if(!err)
        {
            res.send(rows);
        }else
        {
            console.log(err)
        }
    });
});

router.post("/", (req, res)=>{
    // Confere se a req possui todos os campos necessários para uma inserção
    if(req.body && req.body.valor && req.body.data_r && req.body.realizado){
        const valor = req.body.valor
        const data = req.body.data_r
        const realizado = req.body.realizado;
        mysqlCon.query(`INSERT INTO recebimentos VALUES(null, ${valor}, '${data}', ${realizado})`, (err, rows, fields)=>{
            if(!err)
            {
                res.send(rows);
            }else
            {
                console.log(err)
            }
        });
    }
});

router.delete('/:id', (req, res) =>{
    mysqlCon.query('DELETE FROM recebimentos WHERE id=' + parseInt(req.params.id),(err, rows, fields)=>{
        if(!err)
        {
            res.send(rows);
        }else
        {
            console.log(err)
        }
    });
});

router.patch('/:id', (req, res) =>{
    if(req.body && req.body.id && req.body.valor && req.body.data_r && req.body.realizado){
        const valor = req.body.valor
        const data = req.body.data_r
        const realizado = req.body.realizado;
        
        mysqlCon.query( `UPDATE recebimentos SET valor=${valor}, 'data_r=${data}', realizado=${realizado}, WHERE id=${id}`, (err, rows, fields)=>{
            if(!err)
            {
                res.send(rows);
            }else
            {
                console.log(err)
            }
        });
    }
});

module.exports = router;