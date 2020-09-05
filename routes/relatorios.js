const express = require("express");
const mysqlCon = require("../connection")
const {isAuth, isAdmin} = require("../isAuth")

const router = express.Router();

router.post("/balanco", async(req, res)=>{
    try{
        let queryR = "SELECT SUM(r.valor) as positivo from recebimentos r";
        let queryP = "SELECT SUM(p.valor) as negativo from pagamentos p";
        let result = {recebido: 0, pago: 0, balanco: 0}

        if(req.body.realizado && ((req.body.data_ini)&&(req.body.data_fim))){
            queryR = queryR.concat(` WHERE r.realizado=1 and r.data_r between '${req.body.data_ini}' and '${req.body.data_fim}'`);
            queryP = queryP.concat(` WHERE p.realizado=1 and p.data_p between '${req.body.data_ini}' and '${req.body.data_fim}'`);
        }

        else if(!req.body.realizado && ((req.body.data_ini)&&(req.body.data_fim))){
            queryR = queryR.concat(` WHERE r.data_r between '${req.body.data_ini}' and '${req.body.data_fim}'`);
            queryP = queryP.concat(` WHERE p.data_p between '${req.body.data_ini}' and '${req.body.data_fim}'`);
        }

        else if(req.body.realizado && !((req.body.data_ini)&&(req.body.data_fim))){
            queryR = queryR.concat(` WHERE r.realizado=1`);
            queryP = queryP.concat(` WHERE p.realizado=1`);
        }

        mysqlCon.query(queryR, (err, rows, fields)=>{
            if(!err)
            {
                result.recebido = rows[0].positivo;
                mysqlCon.query(queryP, (err, rows, fields)=>{
                    if(!err)
                    {
                        result.pago = rows[0].negativo;
                        result.balanco = result.recebido - result.pago;
                        res.send(result);

                    }
                    else{
                        res.send({error: err.message})
                    }
                });
            }else
            {
                res.send({error: err.message})
            }
        });
    }catch(err){
        res.send({
            error: err.message
        })
    }
});

router.post("/listagem_r", async(req, res)=>{
    try{
        let query = "SELECT * FROM recebimentos r";

        if(req.body.realizado && ((req.body.data_ini)&&(req.body.data_fim))){
            query = query.concat(` WHERE r.realizado=1 and r.data_r between '${req.body.data_ini}' and '${req.body.data_fim}'`);
        }

        else if(!req.body.realizado && ((req.body.data_ini)&&(req.body.data_fim))){
            query = query.concat(` WHERE r.data_r between '${req.body.data_ini}' and '${req.body.data_fim}'`);
        }

        else if(req.body.realizado && !((req.body.data_ini)&&(req.body.data_fim))){
            query = query.concat(` WHERE r.realizado=1`);
        }

        mysqlCon.query(query, (err, rows, fields)=>{
            if(!err)
            {
                res.send(rows);
            }else
            {
                res.send({error: err.message})
            }
        });
    }catch(err){
        res.send({
            error: err.message
        })
    }
});

router.post("/listagem_p", async(req, res)=>{
    try{
        let query = "SELECT * FROM pagamentos p";

        if(req.body.realizado && ((req.body.data_ini)&&(req.body.data_fim))){
            query = query.concat(` WHERE p.realizado=1 and p.data_p between '${req.body.data_ini}' and '${req.body.data_fim}'`);
        }

        else if(!req.body.realizado && ((req.body.data_ini)&&(req.body.data_fim))){
            query = query.concat(` WHERE p.data_p between '${req.body.data_ini}' and '${req.body.data_fim}'`);
        }

        else if(req.body.realizado && !((req.body.data_ini)&&(req.body.data_fim))){
            query = query.concat(` WHERE p.realizado=1`);
        }

        mysqlCon.query(query, (err, rows, fields)=>{
            if(!err)
            {
                res.send(rows);
            }else
            {
                res.send({error: err.message})
            }
        });
    }catch(err){
        res.send({
            error: err.message
        })
    }
});

module.exports = router;