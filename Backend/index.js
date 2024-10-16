require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

var mysql      = require('mysql');
var pool  = mysql.createPool({
    connectionLimit : process.env.CONNECTIONLIMIT,
    host            : process.env.DBHOST,
    user            : process.env.DBUSER,
    password        : process.env.DBPASS,
    database        : process.env.DBNAME
  });
 
  app.get('/', (req, res) => {
    res.send(`API version : ${process.env.VERSION}`);
  });


app.get('/authors/:id', (req, res) => {
    pool.query(`SELECT name, birthdate FROM authors `, (err, results)=>{
        if (err){
            res.status(500).json('Hiba az adatok lekérdezésekor!');
            return
        }
        res.status(200).json(results);
    })
});





app.listen(port, ()=>{
    console.log(`Server listening on port ${port}...`);
});