import express from "express"; //module js

const app = express()

const port = process.env.PORT || 3000

app.get('/',(req,res)=>{
    res.send('Server is Ready')
})

app.get('/api/jokes',(req,res)=>{
    const jokes = [
        {
            id:1,
            title:'A joke',
            content:'This is a Joke',
        } ,         
         {
            id:2,
            title:'A joke',
            content:'This is a Joke',
        } ,
         {
            id:3,
            title:'A joke',
            content:'This is a Joke',
        } ,
        {
            id:4,
            title:'A joke',
            content:'This is a Joke',
        } ,
    ]
    res.send(jokes)
})



app.listen(port, ()=>{
    console.log(`Server at http:localhost:${port}`)
})