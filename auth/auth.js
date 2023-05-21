const conn = require('../database/database');

function auth(username,password,res){
    //const values = [username,password];
    conn.query(`select username,password,id_staff from login_details where username=? and password=?`,[username,password],
    function(error,result,fields){
        if(error){
            console.log(error);
        }
        if(result.length > 0){
            const row = result[0];
            const username = row.username;
            const role = row.id_staff;
            if(role===0){
                return res.render('../views/student_dashboard.ejs',{username});
            }else if (role === 1){
                return res.render('../views/staff_dashboard.ejs',{username});
            }
            else if(role===2){
                return res.render('../views/admin.ejs',{username});
            }
            
            
        }else{
            return res.redirect('/');
            
        }
        res.end();
    })
    
}




module.exports = auth;