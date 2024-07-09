const express = require('express')
const mongoose = require('mongoose')
const Book = require('./book');

require('dotenv').config();

const app= express();

app.use(express.json())

const PORT = 3000;

const uri = process.env.MONGODB_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

let books= [];

//add a book
app.post('/books', async (req, res) => {
    const { title, author } = req.body;

    if(!title || !author ){
        return res.status(400).send("Missing title or author");
    }

    let book = new Book({ title: title, author: author});
    book= await book.save();
    res.send(book);
})

//update the book
app.put('/books/:id', (req, res) => {
    const { title, author } = req.body;

    const book= books.find((b) => b.id === parseInt(req.params.id));

    if(!book){
        return res.status(401).send('Book not found');
    }

    book.title= title || book.title;
    book.author= author || book.author;

    res.send(book);

})

//deleting a book
app.delete('/books/:id', (req, res) => {
    const bookIndex= books.findIndex((b) => b.id === parseInt (req.params.id));

    if(bookIndex === -1){
        return res.status(401).send('Book not found!');
    }

    books.splice(bookIndex, 1);
    res.status(204).send('Book deleted!');
})

//get all the books
app.get('/books', async (req, res)=>{
    const books = await Book.find();
    res.send(books);
})

//get a single book
app.get('/books/:id', (req, res) => {
    const book= books.find((b) => b.id === parseInt(req.params.id));
    if(!book){
        return res.status(404).send('Book not found');
    }

    res.json(book);
})

app.get('/', (req, res) => {
    res.send("Hello world! Making my first project myself!");
})

app.listen(PORT, ()=> {
    console.log(`Server is running on ${PORT}`);
});