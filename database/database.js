const mysql = require('mysql');

const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'college_management_system'
});

conn.connect((err)=>{
    if(err){
        console.log('some error occured');
    }else{
        console.log('connected db successfully');
    }
})

module.exports = conn;
