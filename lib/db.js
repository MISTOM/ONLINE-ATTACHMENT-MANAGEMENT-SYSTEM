var mysql=require('mysql');
 var connection=mysql.createConnection({
   host:'localhost',
   user:'root',
   password:'',
   database:'get_letter'
 });
connection.connect(function(error){
   if(!!error){
     console.log('SOmething Went Wrong...',error);
   }else{
     console.log('Connected!:)');
   }
 });  
module.exports = connection;