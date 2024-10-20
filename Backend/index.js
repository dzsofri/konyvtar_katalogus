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
   

// Könyv lekérdezése ID alapján
app.get('/books/:id', (req, res) => {
    const bookId = req.params.id;
    pool.query('SELECT * FROM books WHERE ID = ?', [bookId], (err, results) => {
        if (err) {
            res.status(500).send('Hiba történt az adatbázis lekérés közben!');
            return;
        }

        if (results.length > 0) {
            let book = results[0];
            book.releasedate = moment(book.releasedate).format('YYYY-MM-DD'); // Dátum formázás
            res.status(200).send(book);
        } else {
            res.status(404).send('Könyv nem található');
        }
    });
});


// Könyvek lekérdezése
app.get('/books', (req, res) => {
  const sql = `
      SELECT 
          books.ID, 
          books.title, 
          books.releasedate, 
          books.ISBN, 
          GROUP_CONCAT(authors.name SEPARATOR ', ') AS authorNames
      FROM 
          books
      LEFT JOIN 
          book_authors ON books.ID = book_authors.bookID
      LEFT JOIN 
          authors ON book_authors.authorsID = authors.ID
      GROUP BY 
          books.ID;
  `;
  
  pool.query(sql, (err, results) => {
      if (err) {
          return res.status(500).send(err);
      }

      // A kiadási dátumok formázása
      results.forEach(book => {
          book.releasedate = moment(book.releasedate).format('YYYY-MM-DD'); // Változtasd meg a formátumot, ha szükséges
      });

      res.json(results); // Az eredmény visszaadása JSON formátumban
  });
});
// Könyv feltöltése
app.post('/books', (req, res) => {
  const { title, releasedate, ISBN, authorID } = req.body; // Kinyerjük az authorID-t is

  // Kötelező adatok ellenőrzése
  if (!title || !releasedate || !ISBN) {
      return res.status(400).send('Minden mező kitöltése kötelező!');
  }

  const bookID = uuid.v4();
  // Könyv hozzáadása
  pool.query(`INSERT INTO books (ID, title, releasedate, ISBN) VALUES(?, ?, ?, ?)`, [bookID, title, releasedate, ISBN], (err) => {
      if (err) {
          console.error('Könyv hozzáadása hiba:', err); // Hiba kiírása a konzolra
          return res.status(500).send('Hiba történt az adatbázis művelet közben!');
      }

      // Ha van authorID, adjuk hozzá a book_authors táblához
      if (authorID) {
          pool.query(`INSERT INTO book_authors (bookID, authorsID) VALUES(?, ?)`, [bookID, authorID], (err) => {
              if (err) {
                  console.error('Szerző hozzáadása hiba:', err); // Hiba kiírása a konzolra
                  return res.status(500).send('Hiba történt az adatbázis művelet közben!');
              }
              return res.status(201).send('A feltöltés sikeres!'); // Használj 201-es státuszkódot a sikeres létrehozásnál
          });
      } else {
          // Ha nincs authorID, csak a könyv létrehozásának sikerét jelezzük
          return res.status(201).send('A feltöltés sikeres, de nincs hozzárendelt szerző!');
      }
  });
});


  // könyv törlése id alapján
app.delete('/books/:id', (req, res) => {
 
    if (!req.params.id) {
      res.status(203).send('Hiányzó azonosító!');
      return;
    }
   
    pool.query(`DELETE FROM books WHERE ID='${req.params.id}'`, (err, results) => {
     
      if (err){
        res.status(500).send('Hiba történt az adatbázis lekérés közben!');
        return;
      }
     
      if (results.affectedRows == 0){
        res.status(203).send('Hibás azonosító!');
        return;
      }
   
      res.status(200).send('Könyv törölve!');
      return;
   
    });
  });

// Könyv módosítása ID alapján
app.patch('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const { title, releasedate, ISBN, authorID } = req.body;

  if (!bookId || !title || !releasedate || !ISBN || !authorID) {
      return res.status(400).send('Hiányzó adatok!');
  }

  // Könyv adatainak frissítése
  pool.query(`UPDATE books SET title=?, releasedate=?, ISBN=? WHERE ID=?`, [title, releasedate, ISBN, bookId], (err, results) => {
      if (err) {
          return res.status(500).send('Hiba történt az adatbázis műveletek során!');
      }

      if (results.affectedRows === 0) {
          return res.status(404).send('Hibás azonosító!');
      }

      // Frissítjük a kapcsolótáblát is
      pool.query(`INSERT INTO book_authors (bookID, authorsID) VALUES (?, ?) ON DUPLICATE KEY UPDATE authorsID=?`, [bookId, authorID, authorID], (err) => {
          if (err) {
              return res.status(500).send('Hiba történt a kapcsolótábla frissítésekor!');
          }

          res.status(200).send('A könyv adatai módosítva!');
      });
  });
});


//_______________



app.listen(port, ()=>{
    console.log(`Server listening on port ${port}...`);
});