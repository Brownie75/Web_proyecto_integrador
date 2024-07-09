const express = require("express");
const db = require("mysql2");
const server = express();
const cors = require("cors");
const bodyParser = require("body-parser");

server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());
server.use(cors());

const conn = db.createConnection({
    host: "localhost",
    user: "root",
    password: "EseKuEle",
    port: 3306,
    database: "db_chefencasa"
});
conn.connect((err) => {
    if(err){
      console.log("Error connecting to database", err);
    } else console.log("Connected to database");
  });
server.listen(3000, () =>{
    console.log("Server is running on http://localhost:3000");
});

// API (Pendiente de cambiar)

server.get("/", (req,res) => {
    console.log("GET /");
    console.log(res.query);
    res.send("Bienvenido a Chef en Casa");
})

server.get("/user", (req, res) => {
    conn.query("SELECT * FROM usuarios", (error, results) => {
        if(error){
            console.log("Error fetching data",error);
            res.send("Error fetching data",500);
          } else {
            console.log("Data fetched succesfully");
            res.send(results);
          }
    });
})
server.get("/user/:id", (req, res) =>{
    const id = req.params.id;
    conn.query("SELECT * FROM usuarios WHERE id_user = ?",[id], (error, results) =>{
    if(error){
      console.log("Error fetching data", error);
      res.send("Error fetching data", 500);
    } else {
      console.log("data fetch successfully");
      res.send(results);
    }
  });
})

server.post()