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
    let query = '';
    //let params = username;

    switch (buttonclicked) {
        case 'attendanceBtn':
            console.log("attendance btn clicked");
            query = `SELECT (COUNT(CASE WHEN attendance = 'present' THEN 1 END) / COUNT(*)) * 100 AS attendance FROM academics WHERE email = ?;`;
            break;
        case 'gradesBtn':
            console.log('grades clicked')
            query = `SELECT gpa FROM academics WHERE email = ?`;
            break;
        case 'dobbtn':
            console.log('DOB button clicked');
            query= `SELECT date_of_birth from student where email=?`;
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

app.get('/teachers-dashboard',(req,res)=>{
    const btn = req.query.button;
    console.log(btn)
    let query = ''
    const studid = req.query.student_id;
    const attnd = req.query.attnd;
    const cgpa = req.query.cgpa;
    console.log(studid)
    switch(btn){
        case 'get-stud-details':
            console.log('get stud detail button clicked');
            if (!studid) {
                console.log('no stud id')
                return res.status(400).json({ message: 'Invalid student ID' });
              }
            query = `select * from academics where student_id =${studid};`;//might be vulnerable to sqli
            break;
        case 'updatebtn':
            console.log('inside update button');
            query = `update academics set attendance=${attnd} and GPA=${cgpa} where student_id=${studid}`;//might be vulnerable to sqli
            break;

        default:
            res.status(500).json({message:'invalid'})
    }
    conn.query(query,(error,details)=>{
        //console.log(studid)
        console.log('inside query');
        console.log(query)
        if(error){
            console.log(error);
            return res.status(500).json({message:'some error'})
        }else{
            if(details.length === 0){
                return res.status(404).json({message:'not found'});
            }
            let data = details[0];
           return res.json(data);
        }
    })

})

app.listen(PORT, (req, res) => {
    console.log(`App listening on port ${PORT} `);
})