const express = require("express");

const bodyParser = require("body-parser");

const mongodb = require('mongodb');

const bcrypt = require('bcrypt');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine","ejs");

const MongoClient = mongodb.MongoClient;
const url = "mongodb+srv://Beetroot16:Vishrut1@cluster0.7cgrkk2.mongodb.net/?retryWrites=true&w=majority";

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) throw err;
  const db = client.db('EasyBizz');

  app.get('/', (req, res) => {
    res.render('login');
  });
    
  app.post('/submit', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) throw err;
      db.collection('users').insertOne({
          firstName: firstName ,
          lastName: lastName,
          password: hash,
          email: email,
      }, 
      (err, result) => {
          if (err) throw err;
          console.log('Data inserted');
          // client.close();
        });
      res.render('login');
    });

    app.post('/login', (req, res) => {
      const email = req.body.email;
      const password = req.body.password;
      db.collection('users').find({email:email}).toArray((err,result) => {
        if (err) throw err;
        console.log(result);
      });
      res.render('success');
    });
  });
    app.listen(3000, () => console.log('Server started on port 3000'));
  });