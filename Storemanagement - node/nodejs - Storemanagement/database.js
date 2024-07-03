const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sql = require("mssql");
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3001",
  })
);
app.use(express.static("public"));

app.use(bodyParser());

const config = {
  server: "RITHIKA\\SQLEXPRESS",
  user: "rithi",
  password: "1234",
  database: "StoreManagement",
  options: {
    trustServerCertificate: true,
    encrypt: true,
  },
};
const pool = new sql.ConnectionPool(config);

pool
  .connect()
  .then(() => {
    console.log("Connected to MSSQL database.");
  })
  .catch((err) => {
    console.error("Error connecting to MSSQL database:", err);
  });
app.use((req, res, next) => {
  // console.log(req)
  req.body.APIType = req.originalUrl.substring(1);
  return next();
});
// middleware
app.listen(9000);

function JsonToSql(data) {
  var ReturnData = [];
  for (var key in data) {
    ReturnData.push("@" + key + " = '" + ( (typeof data[key] === 'boolean' ? (data[key] ? 1 : 0) : (typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]) ) )+ "'" )
    // if (data[key] === "" || data[key] === null) {
    //   ReturnData.push("@" + key + " = NULL");
    // } else if (!isNaN(data[key])) {
    //   ReturnData.push("@" + key + " = " + data[key]);
    // } else {
    //   ReturnData.push("@" + key + " = '" + data[key] + "'");
    // }
  }
  return ReturnData.join(", ");
}

app.post("/ProductFetchData", async (req, res) => {
  try {
    var data = req.body;
    // console.log(data, JsonToSql(data));
    const sqlQuery = `EXEC CombinedProductProcedure 
    ${JsonToSql(data)}`;
    // console.log(data);
    // console.log(sqlQuery);
    const result = await pool.request().query(sqlQuery);
    console.log("Working");
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Unable to retrieve data" });
  }
});

app.post("/ProductfetchAllData", async (req, res) => {
  try {
    var data = req.body;
    const sqlQuery = `EXEC CombinedProductProcedure 
    ${JsonToSql(data)}`;
    console.log(data);
    console.log(sqlQuery);
    const result = await pool.request().query(sqlQuery);
    console.log("Working");
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Unable to retrieve data" });
  }
});

app.post("/InsertProduct", async (req, res) => {
  try {
    var data = req.body;
    const sqlQuery = `EXEC CombinedProductProcedure 
    ${JsonToSql(data)}`;

    console.log(data);
    console.log(sqlQuery);

    const result = await pool.request().query(sqlQuery);

    console.log(result);
    res
      .status(200)
      .json({
        message: result.recordset[0].Message,
        notifier: result.recordset[0].Notifier,
      });
  } catch (error) {
    console.error("Error inserting", error);
    res.status(500).json({ error: "Unable to insert" });
  }
});

app.post("/FetchProductBaseDetails", async (req, res) => {
  try {
    var data = req.body;
    const sqlQuery = `EXEC StoreMaster01 
    ${JsonToSql(data)}`;
    console.log(sqlQuery);
    const result = await pool.request().query(sqlQuery);
    // console.log("Working");
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Unable to retrieve data" });
  }
});
app.post("/StoreProductInsUp", async (req, res) => {
  try {
    var data = req.body;
    const sqlQuery = `EXEC StoreMaster01 ${JsonToSql(data)}`;
    console.log(sqlQuery);
    const result = await pool.request().query(sqlQuery);
    // console.log("Working");
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Unable to retrieve data" });
  }
});

app.post("/StoreCategoryInsUp", async (req, res) => {
  try {
    var data = req.body;
    const sqlQuery = `EXEC StoreMaster01 
    ${JsonToSql(data)}`;
    const result = await pool.request().query(sqlQuery);
    // console.log("Working");
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Unable to retrieve data" });
  }
});

app.post("/FetchRowDetails", async (req, res) => {
  try {
    var data = req.body;
    const sqlQuery = `EXEC StoreMaster01 
    ${JsonToSql(data)}`;
    const result = await pool.request().query(sqlQuery);
    // console.log("Working");
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Unable to retrieve data" });
  }
});

app.post("/FetchLedgerBaseDetails", async (req, res) => {
  try {
    var data = req.body;
    const sqlQuery = `EXEC LedgerMaster01 
    ${JsonToSql(data)}`;
    const result = await pool.request().query(sqlQuery);
    // console.log("Working");
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Unable to retrieve data" });
  }
});

app.post("/FetchLedgerRowDetails", async (req, res) => {
  try {
    var data = req.body;
    const sqlQuery = `EXEC LedgerMaster01 
    ${JsonToSql(data)}`;
    const result = await pool.request().query(sqlQuery);
    // console.log("Working");
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Unable to retrieve data" });
  }
});

app.post("/StoreLedgerInU", async (req, res) => {
  try {
    var data = req.body;
    const sqlQuery = `EXEC LedgerMaster01 
    ${JsonToSql(data)}`;
    const result = await pool.request().query(sqlQuery);
    // console.log("Working");
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Unable to retrieve data" });
  }
});

app.post("/FetchBranchDetails", async (req, res) => {
  try {
    var data = req.body;
    const sqlQuery = `EXEC LedgerMaster01 
    ${JsonToSql(data)}`;
    const result = await pool.request().query(sqlQuery);
    // console.log("Working");
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Unable to retrieve data" });
  }
});


calculateTotal = (tableID) => {
  $(tableID)
    .find("tbody tr td:nth-child(2)")
    .map(function (e) {
      return parseFloat($(e).text()).reduce(
        (total, amount) => total + amount,
        0
      );
    });
};

