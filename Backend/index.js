  require('dotenv').config();
  const express = require('express');
  var mysql = require('mysql');
  const uuid = require('uuid');
  var cors = require('cors');
  const moment = require('moment');

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

 
  app.get('/', (req, res) => {
    res.send(`API version : ${process.env.VERSION}`);
  });

// author műveletek
app.get('/authors', (req, res) => {

    pool.query(`SELECT * FROM authors`, (err, results) => {
      if (err){
        res.status(500).send('Hiba történt az adatbázis lekérés közben!');
        return;
      }
      results.forEach(authors => {
        authors.birthdate = moment(authors.birthdate).format('DD/MM/YYYY');
      });

      res.status(200).send(results);
      return;
    });
});

app.get('/authors/:id', (req, res) => {
  const authorID = req.params.id;
  pool.query('SELECT * FROM authors WHERE ID = ?', [authorID], (err, results) => {
      if (err) {
          res.status(500).send('Hiba történt az adatbázis lekérés közben!');
          return;
      }

      if (results.length > 0) {
          let authors = results[0];
          authors.birthdate = moment(authors.birthdate).format('YYYY-MM-DD'); // Dátum formázás
          res.status(200).send(authors);
      } else {
          res.status(404).send('Könyv nem található');
      }
  });
});

//author upload

app.post('/authors', (req, res)=>{

    // kötelező adatok ellenőrzése
  if (!req.body.name || !req.body.birthdate){
    res.status(203).send('Nem adtál meg minden kötelező adatot!');
    return;
 }

    pool.query(`INSERT INTO authors VALUES('${uuid.v4()}', '${req.body.name}', '${req.body.birthdate}')`, (err, results)=>{
        if (err){
          res.status(500).send('Hiba történt az adatbázis művelet közben!');
          return;
         }
         res.status(202).send('Sikeres volt a fajankó felvétele!');
         return;
      });
      return;
});


app.delete('/authors/:id',(req, res) => {
  
    if (!req.params.id) {
      res.status(203).send('Hiányzó azonosító!');
      return;
    }
  
    pool.query(`DELETE FROM authors WHERE ID='${req.params.id}'`, (err, results) => {
      
      if (err){
        res.status(500).send('Hiba történt az adatbázis lekérés közben!');
        return;
      }
      
      if (results.affectedRows == 0){
        res.status(203).send('Hibás azonosító!');
        return;
      }
  
      res.status(200).send('Felhasználó törölve!');
      return;
  
    });
  });
  
  app.patch('/authors/:id',(req, res) => {
 
    if (!req.params.id) {
      res.status(203).send('Hiányzó azonosító!');
      return;
    }
 
    if (!req.body.name || !req.body.birthdate) {
      res.status(203).send('Hiányzó adatok!');
      return;
    }
 
   
 
    pool.query(`UPDATE authors SET name='${req.body.name}', birthdate='${req.body.birthdate}' WHERE ID='${req.params.id}'`, (err, results) => {
      if (err){
        res.status(500).send('Hiba történt az adatbázis lekérés közben!');
        return;
      }
 
      if (results.affectedRows == 0){
        res.status(203).send('Hibás azonosító!');
        return;
      }
 
      res.status(200).send('A könyv adatok módosítva!');
      return;
    });
  });


// --------------------------- //
   
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