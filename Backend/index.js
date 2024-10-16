
  require('dotenv').config();
  const express = require('express');
  var mysql = require('mysql');
  const uuid = require('uuid');
  var cors = require('cors');

  const app = express();
  const port = process.env.PORT;

   
  // middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
   
  var pool  = mysql.createPool({
    connectionLimit : process.env.CONNECTIONLIMIT,
    host            : process.env.DBHOST,
    user            : process.env.DBUSER,
    password        : process.env.DBPASS,
    database        : process.env.DBNAME
  });
   
  // get API version
  app.get('/', (req, res) => {
      res.send(`API version : ${process.env.VERSION}`);
    });
   

//konyv műveletek
app.get('/books', (req, res) => {

    pool.query(`SELECT * FROM books`, (err, results) => {
      if (err){
        res.status(500).send('Hiba történt az adatbázis lekérés közben!');
        return;
      }
      res.status(200).send(results);
      return;
    });
  });


//_______________

app.listen(port, ()=>{
    console.log(`Server listening on port ${port}...`);
});