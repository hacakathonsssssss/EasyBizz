const express = require("express");

const multer = require("multer");

const bodyParser = require("body-parser");

const mongodb = require('mongodb');

const bcrypt = require('bcrypt');

const path = require('path');

const app = express();

const storage = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null,'./uploads');
  },
  filename: (req,file,cb) => {
    cb(null, file.fieldname+'-'+Date.now()+".png");
  },
});

const upload = multer({storage});

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname,'public')));

app.set("view engine","ejs");

const MongoClient = mongodb.MongoClient;
const url = "mongodb+srv://Beetroot16:Vishrut1@cluster0.7cgrkk2.mongodb.net/?retryWrites=true&w=majority";

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) throw err;
  const db = client.db('EasyBizz');

  app.get('/', (req, res) => {
    res.render('login');
  });
    
  app.post('/submit', (req, res) => { // FOR USER SIGNUP
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
          stage: 0,
      }, 
      (err, result) => {
          if (err) throw err;
          console.log('Data inserted');
          // client.close();
        });
      res.render('login');
    });
  });

  app.post('/signup', (req, res) => { // SIGNUP BUTTON
    res.render('signup');
  });

  app.post('/login', (req, res) => { // USER LOGIN BUTTON
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
            collection.findOne({ email: email },{ projection: { firstName: 1 }} ,function(err,result){
              res.render('userDetails',{ // RENDERS USER DETAILS
                Name: result.firstName,
              });
            })
          }else{
            console.log("dont match");
            res.render('failure');
          }
        });
      });
    });
  });

  app.post('/userDetails', upload.array("images", 10), (req, res) => {
    const address = req.body.address;
    const files = req.files;
    // console.log(req.body.address);
    console.log(files);

    res.render('companyDetails');
  });

  app.post('/adminLogin', (req, res) => {
    res.render('adminLogin');
  });

  app.post('/admin_login_submit', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    bcrypt.hash(password, 10, (err, hash) => {
      const collection = db.collection("admins");
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

  app.post('/adminSignup', (req, res) => {
    res.render('adminSignup');
  });

  app.post('/admin_submit', (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const position = req.body.position;
    const password = req.body.password;
    bcrypt.hash(password, 10, (err, hash) => {
      db.collection('admins').insertOne({
          firstName: firstName ,
          lastName: lastName,
          password: hash,
          email: email,
          position: position,
      },
      (err, result) => {
          if (err) throw err;
          console.log('Data inserted');
          // client.close();
        });
      res.render('adminLogin');
    });
  });

  app.listen(3000, () => console.log('Server started on port 3000'));
});