const mysql = require("mysql"); 

let mysqlCon = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "simpleapi_db",
    multipleStatements : true,
    dateStrings: 'datetime'
})

mysqlCon.connect((err)=>{
    (err)?(console.log("Connection Error")):(console.log("Connected"))
})

module.exports = mysqlCon;