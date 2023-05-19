const conn = require('../database/database');

function auth(username,password,res){

    conn.query(`select username,password from login_details where username=? and password=?`,[username,password],
    function(error,result,fields){
        if(error){
            console.log(error);
        }
        if(result.length > 0){
            return res.render('../views/student_dashboard.ejs',{username});
            
        }else{
            return res.redirect('/');
            
        }
        res.end();
    })
    
}




module.exports = auth;