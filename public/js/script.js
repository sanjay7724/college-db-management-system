const { response } = require("express");

fetch('/student_dashboard').then(response=>response.json())
.then(data=>{
    var tablebody = document.querySelector('#stu');
    var tablerow = document.createElement('tr');
    tablerow.innerHTML = '<td>' + data.name + '</td><td>'+data.student_id+'</td><td>'+data.attendance+'</td><td>'+data.gpa+'</td>'
    tablebody.appendChild(tablerow)
})