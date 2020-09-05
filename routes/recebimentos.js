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
    if(req.body && req.body.valor && req.body.data_r && req.body.realizado && req.body.id_usuario){
        const valor = req.body.valor
        const data = req.body.data_r
        const realizado = req.body.realizado;
        const id_usuario = req.body.id_usuario;
        mysqlCon.query(`INSERT INTO recebimentos VALUES(null, ${valor}, ${data}, ${realizado}, ${id_usuario})`, (err, rows, fields)=>{
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
        let query = ``;
        if(req.body.id_usuario){
            const id_usuario = req.body.id_usuario;
            query = `UPDATE recebimentos SET valor=${valor}, data_p=${data}, realizado=${realizado}, id_usuario=${id_usuario} WHERE id=${id}`;
        }
        else{
            query = `UPDATE recebimentos SET valor=${valor}, data_p=${data}, realizado=${realizado}, WHERE id=${id}`;
        }
        mysqlCon.query(query, (err, rows, fields)=>{
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