const express = require("express");
const mysqlCon = require("../connection");

const router = express.Router();

router.get("/", (req, res)=>{
    // Seleciona toda a informação dos pagamentos
    mysqlCon.query("SELECT * FROM pagamentos", (err, rows, fields)=>{
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
    if(req.body && req.body.id && req.body.valor && req.body.data_p && req.body.realizado){
        const valor = req.body.valor
        const data = req.body.data_p
        const realizado = req.body.realizado;
        mysqlCon.query(`INSERT INTO pagamentos VALUES(null, ${valor}, ${data}, ${realizado})`, (err, rows, fields)=>{
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
    mysqlCon.query('DELETE FROM pagamentos WHERE id=' + parseInt(req.params.id),(err, rows, fields)=>{
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
    if(req.body && req.body.id && req.body.valor && req.body.data_p && req.body.realizado){
        const valor = req.body.valor
        const data = req.body.data_p
        const realizado = req.body.realizado;
        mysqlCon.query(`UPDATE pagamentos SET valor=${valor}, data_p=${data}, realizado=${realizado} WHERE id=${id}`, (err, rows, fields)=>{
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