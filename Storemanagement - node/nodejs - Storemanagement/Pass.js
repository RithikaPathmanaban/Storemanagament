const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sql = require('mssql');
const cors = require('cors');
const { data }= require('jquery');


app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.static('public'));

app.use(bodyParser());

const config = {
    server : 'RITHIKA\\SQLEXPRESS',
    user : 'rithi',
    password : '123',
    database : 'PassMS',
    options:{
        trustServerCertificate : true,
        encrypt : true
    }
}

const pool = new sql.ConnectionPool(config);

pool.connect()
.then(()=>{
    console.log('Connection successful')
})
.catch((err)=>{
    console.log('Error in connection',err);
})

app.listen(9000)

function jsontovariable(data){
    var Data = []
    for(var key in data ){
        Data.push(" @"+key+ " = '"+data[key]+"' ");
    }
    return Data.join(', ');
}

app.get('/passinsert',async(req,res)=>{
    try{
        var data = req.body
        console.log(data)
        console.log('Executing API')
        await sql.connect(config)
        const result = await pool.request()
        console.log(jsontovariable(data))
        result.query('EXEC PassInsert '+ jsontovariable(data));
        console.log('EXEC PassInsert '+ jsontovariable(data));
        await sql.close()
        res.status(201).json({message:'Inserted successfully',data:result.recordset})
        }
    catch(error){
        console.error('Error in insertion',error)
        await sql.close
        res.status(500).json({message:'Unable to insert'})

    }
})