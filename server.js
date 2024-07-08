const express= require('express')

const app= new express();

const PORT = 3000;

app.get('/', (req, res) => {
    res.send("Hello world! Making my first project myself!");
})

app.listen(PORT, ()=> {
    console.log(`Server is running on ${PORT}`);
});