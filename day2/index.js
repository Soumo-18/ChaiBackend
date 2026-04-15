const express = require('express')
const app = express() //app is an instance of express.
require('dotenv').config()
const port =3000
app.get('/',(req,res)=> {
    res.send('Hello World')
})
app.get('/twitter', (req,res)=>{
    res.send('soumodotcom')

})
app.get('/login', (req,res)=>{
    res.send('<h1>Login at ChaiCode</h1>')
})

app.get('/youtube', (req,res)=>{
    res.send('<h2>ChaiCode</h2>')


})
app.listen(process.env.PORT, ()=>{
    console.log(`Example app listening on PORT ${port}`)
})