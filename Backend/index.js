require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : process.env.DBHOST,
  user     : process.env.DBUSER,
  password : process.env.DBPASS,
  database : process.env.DBNAME
});

connection.connect((err)=>{
    if (err){
        console.log(err);
        return;
    }
    console.log(`Connected to MySQL database.`)
});



app.listen(port, ()=>{
    console.log(`Server listening on port ${port}...`);
});