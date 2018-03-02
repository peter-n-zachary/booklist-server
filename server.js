'use strict'

const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser').urlencoded({ extended: true });

const app = express(); //make sure no space between express ()
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

//application middleware
app.use(cors());
// app.get('/', (req, res) => res.send('Testing 1, 2, 3'));

app.get('/api/v1/books', (req, res) => {
  client.query(`SELECT book_id, title, author, image_url, isbn FROM books;`)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

app.get('/api/v1/books/:book_id', (req, res) => {
  client.query(`SELECT * FROM books WHERE book_id=${req.params.book_id};`
  )
    .then(results => res.send(results.rows))
    .catch(console.error);
});

app.post('/api/v1/books', bodyParser, (req, res) => {
  let {title, author, image_url, isbn, description} = req.body;

  client.query(`INSERT INTO books (title, author, image_url, isbn, description) 
    VALUES ($1, $2, $3, $4, $5);`,
    [title, author, image_url, isbn, description])
    .then(() => res.sendStatus(201))
    .catch(console.error);

});

app.delete('/api/v1/book/delete', bodyParser, (request, response) => {
  client.query(`DELETE FROM books WHERE book_id=$1;`,
    [request.body.book_id])
    .then(response.send('book deleted'));
});

app.put('/api/v1/update/:book_id', bodyParser, (req, res) => {
  console.log('hitting server');
  client.query(`
    UPDATE books
    SET author=$1, title=$2, isbn=$3, image_url=$4, description=$5
    WHERE book_id=$6;`,
    [
      req.body.author,
      req.body.title,
      req.body.isbn,
      req.body.image_url,
      req.body.description,
      req.body.book_id
    ]
  )
    .then(() => res.sendStatus(201))
    .catch(console.error);
});



app.get('*', (req, res) => res.redirect(CLIENT_URL));


app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// PORT=3000
// CLIENT_URL=http://localhost:8080

// Mac:
// DATABASE_URL=postgres://localhost:5432/task_app

// Windows:
// DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/task_app
