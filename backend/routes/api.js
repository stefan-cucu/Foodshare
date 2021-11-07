var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'password',
  database: 'foodshare'
});
connection.connect();

var id = 0;
connection.query("SELECT MAX(id) as 'id' FROM tasks;", function(err, results, fields){
  if(err) id = 0;
  else id = parseInt(results[0].id) + 1;
  console.log("id = " + id);
});


/* GET home page. */
router.get('/get', function(req, res, next) {
  connection.query("SELECT * FROM tasks;", function(err, results, fields){
    if(err) throw err;
    const out = Object.values(JSON.parse(JSON.stringify(results)));
    console.log(out);
    res.json(out);
  });
});

router.post('/req', function(req, res, next){
  console.log(req.body);
  
  connection.query("INSERT INTO tasks (id, text, checked, owner) values ("
  + id + ", '" + req.body.name + "', false, 'default');", function(err, results, fields){
    if(err) throw err;
    console.log(results);
  });
  id = id + 1;
})



module.exports = router;
