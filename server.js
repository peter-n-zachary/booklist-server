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
  console.log('app.get for single book');

  client.query(`SELECT * FROM books WHERE book_id=${req.params.book_id};`
  )
    .then(results => res.send(results.rows))
    .catch(console.error);
});

app.post('/api/v1/books', bodyParser, (req, res) => {
  let {title, author, image_url, isbn, description} = req.body;

  client.query(`INSERT INTO books(title, author, image_url, isbn, description) 
    VALUES ($1, $2, $3, $4, $5);`, 
    [title, author, image_url, isbn, description])
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
