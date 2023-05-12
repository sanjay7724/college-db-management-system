const express = require('express');
const app = express();
const env = require('dotenv');
const path = require('path');

const conn = require('./database/database');
const bodyParser = require('body-parser');
const auth = require('./auth/auth');

env.config()

PORT=process.env.PORT

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use('/templates',express.static(path.join(__dirname,'public/templates')));
app.use('/css',express.static(path.join(__dirname,'public/css')));
app.use('/images',express.static(path.join(__dirname,'public/images')));

//app.use('/',express.static('public'));
app.set("view engine","ejs")
app.get('/',(req,res)=>{
    res.render('login')
})

app.post('/',(req,res)=>{

    var username=req.body.username;
    var password=req.body.password;
    console.log(username,password);
    
    auth(username,password,res);
    
    //return res.status(200).render('dashboard');
})


app.listen(PORT,(req,res)=>{
    console.log(`App listening on port ${PORT} `);
})