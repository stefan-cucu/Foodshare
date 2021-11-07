var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var admin = require('firebase-admin');
var serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));
var mysql = require('mysql');

var apiRouter = require('./routes/api');
var usersRouter = require('./routes/users');

var app = express();

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'password',
  database: 'foodshare'
});
connection.connect();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://test-fac03.firebaseio.com"
});

// console.log(serviceAccount);
// console.log(admin.credential.cert);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": true,
  "optionsSuccessStatus": 200
}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);

app.options('/check', function (req, res, next) {
  res.sendStatus(200);
});
app.options('/apiemail', function (req, res, next) {
  res.sendStatus(200);
});
app.options('/apicreateprofile', cors());
app.options('/apiadditem', cors());
app.options('/apiaddreq', cors());
app.options('/apigetitems', cors());
app.options('/apigetreqs', cors());
app.options('/apigetreq', cors());
app.options('/apiupdatereq', cors());
app.options('/apigettype', cors());

// GET check if account exists
app.put('/check', function (req, res, next) {
  console.log(req.body);
  connection.query("SELECT EXISTS(SELECT * FROM users WHERE email = '" + req.body.email + "') AS 'check';", function (err, results, fields) {
    if (err) console.log(err);
    else {
      const out = Object.values(JSON.parse(JSON.stringify(results)));
      res.json(out[0]);
    }
  });
})

// PUT add email 
app.put('/apiemail', function (req, res, next) {
  console.log(req.body);
  connection.query("INSERT INTO users (email) values ('" + req.body.email + "');", function (err, results, fields) {
    if (err) console.log(err);
    else {
      const out = Object.values(JSON.parse(JSON.stringify(results)));
      res.sendStatus(200);
    }
  });
})

// POST create profile
app.post('/apicreateprofile', function (req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decode = admin.auth().verifyIdToken(token).then((data) => (console.log(data)));
  } catch (e) {
    console.log(e);
    return res.send('Connection denied');
  }
  console.log(req.body)
  connection.query("UPDATE users SET type = '" + req.body.type + "' WHERE email = '" + req.body.email + "';", function(err, results, fields){
    console.log('yay');
  });

  if (req.body.type == 2) {
    connection.query("INSERT INTO volunteers (name, email, phone, age, gender) values ('" + req.body.name + "', '" + req.body.email + "', '" + req.body.phone + "', '" + req.body.age + "', '" + req.body.gender + "');", function (err, results, fields) {
      if (err) console.log(err);
      const out = Object.values(JSON.parse(JSON.stringify(results)));
      console.log(out);
      
    });
  }
  else if (req.body.type == 3) {
    connection.query("INSERT INTO shelters (name, email, phone, lat, lng) values ('" + req.body.name + "', '" + req.body.email + "', '" + req.body.phone + "', '" + req.body.lat + "', '" + req.body.lng + "');", function (err, results, fields) {
      if (err) console.log(err);
      const out = Object.values(JSON.parse(JSON.stringify(results)));
      console.log(out);
    });
  }
  else {
    connection.query("INSERT INTO provider (name, email, phone, lat, lng) values ('" + req.body.name + "', '" + req.body.email + "', '" + req.body.phone + "', '" + req.body.lat + "', '" + req.body.lng + "');", function (err, results, fields) {
      if (err) throw err;
      const out = Object.values(JSON.parse(JSON.stringify(results)));
      console.log(out);
    });
  }
  res.send('yay');
})

// POST add item
app.post('/apiadditem', function (req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decode = admin.auth().verifyIdToken(token).then((data) => (console.log(data)));
  } catch (e) {
    console.log(e);
    return res.send('Connection denied');
  }

  connection.query("INSERT INTO items (name, expiration_date, quantity, provider_name) values ('" + req.body.type + "', '" + req.body.date + "', '" + req.body.quantity + "', '" + req.body.provider + "');", function (err, results, fields) {
    if (err) throw err;
    const out = Object.values(JSON.parse(JSON.stringify(results)));
    console.log(out);
  });

  res.send('yay');
})

// POST add request
app.post('/apiaddreq', function (req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decode = admin.auth().verifyIdToken(token).then((data) => (console.log(data)));
  } catch (e) {
    console.log(e);
    return res.send('Connection denied');
  }

  connection.query("INSERT INTO requests (id, meat, dairy, fish, vegetables, fruits, bread, chocolate, eggs, shelter) values ('" + req.body.name + "', '" + req.body.meat + "', '" + req.body.dairy + "', '" + req.body.fish + "', '" + req.body.vegetables + "', '" + req.body.fruits + "', '" + req.body.bread + "', '" + req.body.chocolate + "', '" + req.body.eggs + "', '" + req.body.shelter + "');", function (err, results, fields) {
    if (err) throw err;
    const out = Object.values(JSON.parse(JSON.stringify(results)));
    console.log(out);
  });

  res.send('yay');
});

// GET all items from company
app.put('/apigetitems', function (req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decode = admin.auth().verifyIdToken(token).then((data) => (console.log(data)));
  } catch (e) {
    console.log(e);
    return res.send('Connection denied');
  }

  connection.query("SELECT name as 'Name', expiration_date as 'Date', quantity as 'Quantity' FROM items WHERE provider_name = '" + req.body.provider + "';", function (err, results, fields) {
    if (err) throw err;
    const out = Object.values(JSON.parse(JSON.stringify(results)));
    console.log(out);
    res.json(out);
  });
});

// GET all reqs
app.put('/apigetreqs', function (req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decode = admin.auth().verifyIdToken(token).then((data) => (console.log(data)));
  } catch (e) {
    console.log(e);
    return res.send('Connection denied');
  }

  connection.query("SELECT DISTINCT r.id as 'id', r.meat as 'meat', r.dairy as 'dairy', r.fish as 'fish', r.vegetables as 'vegetables', r.fruits as 'fruits', r.bread as 'bread', r.chocolate as 'chocolate', r.eggs as 'eggs', r.shelter as 'shelter', v.name as 'vname', s.name as 'name' FROM requests r JOIN shelters s ON s.email = r.shelter JOIN volunteers v ON r.volunteer = v.email", function (err, results, fields) {
    if (err) throw err;
    const out = Object.values(JSON.parse(JSON.stringify(results)));
    console.log(out);
    res.json(out);
  });
})

//GET req
app.put('/apigetreq', function (req, res, next) {
  connection.query("SELECT DISTINCT r.id as 'id', r.meat as 'meat', r.dairy as 'dairy', r.fish as 'fish', r.vegetables as 'vegetables', r.fruits as 'fruits', r.bread as 'bread', r.chocolate as 'chocolate', r.eggs as 'eggs', s.name as 'name', s.lat as 'lat', s.lng as 'lng' FROM requests r JOIN shelters s ON s.email = r.shelter WHERE id = '" + req.body.reqID + "';", function (err, results, fields) {
    if (err) throw err;
    const out = Object.values(JSON.parse(JSON.stringify(results)));
    const query = "SELECT provider_name FROM items WHERE name = 'Meat' GROUP BY provider_name HAVING NVL(SUM(quantity), 0) >= '" + out[0].meat + "' INTERSECT SELECT provider_name FROM items WHERE name = 'Dairy Products' GROUP BY provider_name HAVING NVL(SUM(quantity), 0) >= '" + out[0].dairy + "' INTERSECT SELECT provider_name FROM items WHERE name = 'Fish' GROUP BY provider_name HAVING NVL(SUM(quantity), 0) >= '" + out[0].fish + "' INTERSECT SELECT provider_name FROM items WHERE name = 'Vegetables' GROUP BY provider_name HAVING NVL(SUM(quantity), 0) >= '" + out[0].vegetables + "' INTERSECT SELECT provider_name FROM items WHERE name = 'Fruits' GROUP BY provider_name HAVING NVL(SUM(quantity), 0) >= '" + out[0].fruits + "' INTERSECT SELECT provider_name FROM items WHERE name = 'Bread' GROUP BY provider_name HAVING NVL(SUM(quantity), 0) >= '" + out[0].bread + "' INTERSECT SELECT provider_name FROM items WHERE name = 'Chocolate' GROUP BY provider_name HAVING NVL(SUM(quantity), 0) >= '" + out[0].chocolate + "' INTERSECT SELECT provider_name FROM items WHERE name = 'Eggs' GROUP BY provider_name HAVING NVL(SUM(quantity), 0) >= '" + out[0].eggs + "';";
    connection.query(query, function (err, results, fields) {
      if (err) return ;
      const out2 = Object.values(JSON.parse(JSON.stringify(results)));
      console.log(out2[0]);
      connection.query("SELECT name as 'pname', lat as 'plat', lng as 'plng' FROM provider WHERE email = '" + out2[0].provider_name + "';", function (err, results, fields){
        if (err) return ;
        const out3 = Object.values(JSON.parse(JSON.stringify(results)));
        console.log(out3[0]);
        console.log({
          ...out[0],
          pname: out3[0].pname,
          plat: out3[0].plat,
          plng: out3[0].plng
        });
        res.json({
          ...out[0],
          pname: out3[0].pname,
          plat: out3[0].plat,
          plng: out3[0].plng
        });
      });
    })
    //console.log(out);
    
  });
})

//Update req
app.put('/apiupdatereq', function(req, res, next) {
  connection.query("UPDATE requests SET volunteer = '" + req.body.email + "' WHERE id = '" + req.body.id + "';", function (err, results, fields){
    if(err) return;
    const out = Object.values(JSON.parse(JSON.stringify(results)));
    console.log(out);
    res.json(out);
  })
})

//Get type
app.put('/apigettype', function(req, res, next){
  connection.query("SELECT type FROM users WHERE email = '" + req.body.email +"';", function (err, results, fields){
    if(err) return;
    const out = Object.values(JSON.parse(JSON.stringify(results)));
    console.log(out);
    console.log("SELECT type FROM users WHERE email = '" + req.body.email +"';");
    res.json(out);
  });
})

app.use(express.static(path.join(__dirname, 'build')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
