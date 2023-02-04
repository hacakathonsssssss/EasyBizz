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
  });

  app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, 10, (err, hash) => {
      const collection = db.collection("users");
      collection.findOne({ email: email }, { projection: { password: 1 }} ,function(err, result) {
        bcrypt.compare(password,result.password,function(err,result){
          if(err){
            console.log(err);
            return;
          }
          if(result){
            console.log("match");
            res.render('success');
          }else{
            console.log("dont match");
            res.render('failure');
          }
        });
      });
    });
  });

  app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, 10, (err, hash) => {
      const collection = db.collection("users");
      collection.findOne({ email: email }, { projection: { password: 1 }} ,function(err, result) {
        bcrypt.compare(password,result.password,function(err,result){
          if(err){
            console.log(err);
            return;
          }
          if(result){
            console.log("match");
            res.render('success');
          }else{
            console.log("dont match");
            res.render('failure');
          }
        });
      });
    });
  });
  
  app.listen(3000, () => console.log('Server started on port 3000'));
});