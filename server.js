'use strict'

const express = require('express');
const cors = require('cors');
const pg = require('pg');

const app = express ();
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

//application middleware
app.use(cors());

app.get('/api/v1/books', (req, res) => {
    client.query(`SELECT book_id, title, author, image_url, isbn FROM books;`)
    .then(results => res.send(results.rows))
    .catch(console.error);
});

app.get('*', (req, res) => res.redirect(CLIENT_URL));

app.get('/', (req, res) => res.send('Testing 1, 2, 3'));

<<<<<<< HEAD
// app.get('*', (req, res) => res.redirect(CLIENT_URL));  // this can be used to redirect a user in case of error

app.listen(PORT, () => console.log('Listening on port: ${PORT}'));
=======
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
>>>>>>> dddece3ca0f093b00cf72a73c7be8a5a47890303

// PORT=3000
// CLIENT_URL=http://localhost:8080

// Mac:
// DATABASE_URL=postgres://localhost:5432/task_app

// Windows:
// DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/task_app
