const express= require('express')

const app= express();

app.use(express.json())

const PORT = 3000;

let books= [];

//add a book
app.post('/books', (req, res) => {
    const { title, author } = req.body;

    if(!title || !author ){
        res.status(400).send("Missing title or author");
    }

    else{
        const newBook= {id: books.length + 1, title, author};

        books.push(newBook);
        res.status(200).send(newBook);
    }
})

//get all the books
app.get('/books', (req, res)=>{
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