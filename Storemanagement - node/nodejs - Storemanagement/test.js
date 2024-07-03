const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const sql = require("mssql")
const cors = require('cors')

app.use(cors({
    origin:""
}))

app.use(express.static('public'));
app.use(bodyParser())

const config = {
    server : 'RITHIKA\\SQLEXPRESS',
    user : 'rithi',
    password : '1234',
    database : 'CMS',
    options : {
        trustServerCertificate : true,
        encrypt : true
    }
    
}

const pool = new sql.ConnectionPool(config)

pool.connect()

.then(()=>{
    console.log("Succcess")
})
.catch((err)=>{
    console.error("",error)
})

app.listen(9000)





const express = require("express");
const app = express();
const sql = require("mssql");
const bodyParser =  require("body-parser");
const cors = require("cors")

app.use(cors({
    origin : ""
}))

app.use(express.static("public"))

app.use(bodyParser())

const config = {
    server : "",
    database : "",
    user: "",
    password:"",
    options:{
        trustServerCertificate :true,
        encrypt : true,
    }
}

const pool = new sql.ConnectionPool(config)

pool.connect()

.then(()=>{
    console.log("")
})
.catch((error)=>{
    console.error("",error)
})
app.listen(9000)


// function JsonToSql(data){
//     var ReturnData=[]
//     for (var key in data){
//         ReturnData.push(" @"+key+" = '"+data[key]+"' ");
//     }
//     return ReturnData.join(' ,');
// }



function JsonToSql(data){
    var ReturnData=[]
    for ( var key in data){
    ReturnData.push(" @"+key+" = '"+data[key]+"' ")
    }
    return ReturnData.join(' ,')
}


app.post('/' ,async(req,res)=>{
    try{
    const result = await pool.request().query("");
    console.log("");
    res.status(200).json(result.recordset)
    }
    catch(error){
        console.log("",error)
        res.status(500).json({error:"Unable to fetch data"})
    }

})



app.post("",async(req,res)=>{
    try{
const ProductID = req.body.ProductID;
console.log("");
const result = await pool.request().query("",+ ProductID )
res.status(200).json(result.recordset)
}
catch(error){
    console.log("",error)
    res.status(500).json({error:"unable"})
}
})


app.post("",async(req,res)=>{
    try{
        var data = req.data;
        console.log();
        await sql.connect(config);

        const result = await pool.connect.request().query(""+JsonToSql(data))
        res.status(200).json({message:result.rescordset[0].Message,notifier:result.recordset[0].Notifier})
    }

    catch(error){
        console("",error);
        res.status(500).json({error:"unable"})
    }
})