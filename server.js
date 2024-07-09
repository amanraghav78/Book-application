const express = require('express')
const mongoose = require('mongoose')
const Book = require('./book');
const Joi = require('joi');
const helmet = require('helmet');

require('dotenv').config();

const app= express();

app.use(express.json())
app.use(helmet());

const PORT = 3000;

const uri = process.env.MONGODB_URI;

function validateBook(book){
    const schema= Joi.object({
        title: Joi.string().min(3).required(),
        author: Joi.string().min(3).required()
    });

    return schema.validate(book);
}

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

let books= [];

//add a book
app.post('/books', async (req, res) => {

    const { error } = validateBook(req.body); 
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    try{
        let book = new Book({ title: req.body.title, author: req.body.author});
        book= await book.save();
        res.send(book);
    } catch(err){
        res.status(400).send(err.message);
    }
})

//update the book
app.put('/books/:id', async (req, res) => {

    const { error } = validateBook(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    const book= await Book.findByIdAndUpdate(req.params.id, { title: req.body.title, author: req.body.author }, { new: true});

    if(!book){
        return res.status(401).send('Book not found');
    }

    res.send(book);

})

//deleting a book
app.delete('/books/:id', async (req, res) => {
    const book= await Book.findByIdAndDelete(req.params.id);

    if(!book){
        return res.status(401).send('Book not found!');
    }

    res.status(204).send('Book deleted');
})

//get all the books
app.get('/books', async (req, res)=>{
    const books = await Book.find();
    res.send(books);
})

//get a single book
app.get('/books/:id', async (req, res) => {
    try{
        const book= await Book.findById(req.params.id);
        if(!book){
            return res.status(404).send('Book not found');
        }
        res.send(book);
    } catch(err){
        res.status(500).send('Something went wrong!');
    }
})

app.get('/', (req, res) => {
    res.send("Hello world! Making my first project myself!");
})

app.listen(PORT, ()=> {
    console.log(`Server is running on ${PORT}`);
});