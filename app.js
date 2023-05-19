const express = require('express');
const app = express();
const env = require('dotenv');
const path = require('path');

const conn = require('./database/database');
const bodyParser = require('body-parser');
const auth = require('./auth/auth');

env.config({ path: 'config.env' })

PORT = process.env.PORT

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use('/templates', express.static(path.join(__dirname, 'public/templates')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

//app.use('/',express.static('public'));
app.set("view engine", "ejs")
app.get('/', (req, res) => {
    res.render('login')
})
var username
var password
app.post('/', (req, res) => {

    username = req.body.username;
    password = req.body.password;
    console.log(username, password);

    auth(username, password, res)



    //return res.status(200).render('dashboard');
})

app.get('/student-data', (req, res) => {
    const buttonclicked = req.query.button; //pass the button identifier as query in parameter

    // let params = [username];

    // let query = '';
    // switch(buttonclicked){
    //     case 'attendanceBtn':
    //         query = `SELECT 
    //         (COUNT(CASE WHEN attendance = 'present' THEN 1 END) / COUNT(*)) * 100 AS attendance_percentage 
    //     FROM academics 
    //     WHERE email = ?;`,[username];
    //     break;
    //     case 'gradesBtn':
    //         query = `select gpa from academics where email=?;`,[username];
    //     break;
    //     default:
    //         res.status(500).json({error:'invalid'})
    //         return
    // }
    let query = '';
    //let params = username;

    switch (buttonclicked) {
        case 'attendanceBtn':
            console.log("attendance btn clicked");
            query = `SELECT (COUNT(CASE WHEN attendance = 'present' THEN 1 END) / COUNT(*)) * 100 AS attendance_percentage FROM academics WHERE email = ?;`;
            break;
        case 'gradesBtn':
            console.log('grades clicked')
            query = `SELECT gpa FROM academics WHERE email = ?`;
            break;
        default:
            console.log('default')
            res.status(500).json({ error: 'no btn clicked' });
            return;
    }
    conn.query(query,[username], (error, results) => {
        console.log('inside query')
        if (error) {
            console.log(error);
            res.status(500).json({ error: 'some error' })
        } else {
            let studdata = results[0];
            res.json(studdata)
        }
    })
})

/*app.get('/student_dashboard',(req,res)=>{
    var username = req.body.username;

    if(!username){
        res.redirect('/');
        return;
    }else{
        conn.query(`select name,student_id,GPA from academics where username=?`,[username],(err,data)=>{
            if(err){
                console.log(err);
                return;
            }
            res.render('/views/student_dashboard',{data:data[0]});
            
        })
    }
})*/

app.listen(PORT, (req, res) => {
    console.log(`App listening on port ${PORT} `);
})