const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const sql = require('mssql')
const cors = require('cors')
const data = require('jquery')


app.use(cors({
  origin:'http://localhost:3000'
}));

app.use(express.static('public'));

app.use(bodyParser())
const config={
  server :'RITHIKA\\SQLEXPRESS',
  user:'rithi',
  password :'123',
  database : 'Canteen',
  options:{
    trustServerCertificate:true,
    encrypt:true
  }
}

const pool = new sql.ConnectionPool(config);


pool.connect()
.then(()=>{
  console.log("Connection succesfull");
})
.catch((err)=>{
  console.log("Error conencting the database",err);
})

app.listen(8000)

function jsontosql(data){
  var Return = []
  for (var key in data){
    Return.push(" @"+key+" = '"+data[key]+"' ");
  }
  return Return.join(', ')
}


app.post('/insert',async(req,res)=>{
  try{
    var data = req.body;
    console.log(data)
    console.log('Executing Insert ajax')
    await sql.connect(config);
    const result = await pool.request() 
    console.log(jsontosql(data))
    console.log("EXEC EmployeeInsert " + jsontosql(data))
    result.query("EXEC EmployeeInsert " + jsontosql(data));
    await sql.close();
    res.status(201).json({message:'Inserted successfully',data:result.recordset});
  }
  catch(error){
    console.error('Error inserting',error);
    await sql.close();
    res.status(500).json({error:'Unable to insert'});
  }
})