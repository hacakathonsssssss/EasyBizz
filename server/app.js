const express = require("express");

const multer = require("multer");

const bodyParser = require("body-parser");

const mongodb = require('mongodb');

const bcrypt = require('bcrypt');

const path = require('path');

const app = express();

var user_email = '';
var user_firstname = '';

var storage = multer.diskStorage({ // configure user storage
  destination: (req,file,cb) => {
    cb(null,'./uploads');
  },
  filename: (req,file,cb) => {
    cb(null, user_firstname + ".png");
  },
});

var upload = multer({storage});

app.use(bodyParser.urlencoded({extended: false}));

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
          verified: false,
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
            user_email = req.body.email;
            collection.findOne({ email: email },{ projection: { firstName: 1 }} ,function(err,result){
              user_firstname = result.firstName;
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

  app.post('/tryAgain', (req, res) => { // SIGNUP BUTTON
    res.render('login');
  });

  app.post('/userDetails', upload.array("images", 10), (req, res) => {
    const address = req.body.address;
    // const files = req.files;
    const collection = db.collection("users");

    var storage = multer.diskStorage({ // configure user storage
      destination: (req,file,cb) => {
        cb(null,'./uploads');
      },
      filename: (req,file,cb) => {
        const index = req.body.fileIndex;
        const fixedSuffix = ['Address_proof' , 'Adhaar', 'PAN' , 'License' , 'Passport'];
        cb(null, `image-${fixedSuffixes[index]}-${user_firstname}.png`);
      },
    });
    var upload = multer({storage});

    collection.updateOne({ email: user_email }, { $set: { address: req.body.address } }, function(err, res) {
      console.log(user_email);
      console.log("Document updated");
    });

    res.render('companyDetails');
  });

  app.post('/companyDetails', upload.array("images", 10), (req, res) => {
    const company_type = req.body.companyType;
    const company_address = req.body.companyAddress;
    const staff_count = req.body.staffCount;
    const objective = req.body.objective;
    // const files = req.files;
    const collection = db.collection("users");
    collection.updateOne(
      { email: user_email }, 
      { $set: 
        { 
          companyType: req.body.companyType, 
          companyAdress: req.body.companyAddress, 
          staffCount: req.body.staffCount,
          objective: req.body.objective,
        } 
      }, function(err, res) {
      // console.log(req.body.companyAddress);
    });

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
            db.collection('users').find({}).toArray((err, data) => {
              if (err) {
                console.error(err);
                return;
              } 
              res.render('adminHome', { data });
            });
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
    const username = req.body.username;
    const position = req.body.position;
    const password = req.body.password;
    bcrypt.hash(password, 10, (err, hash) => {
      db.collection('admins').insertOne({
          firstName: firstName ,
          lastName: lastName,
          password: hash,
          username: username,
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

  app.post('/verify', upload.array("images", 10), (req, res) => {
    const collection = db.collection("users");
    const email = req.body.button0;
    console.log(email);
    collection.updateOne(
      { email: user_email }, 
      { $set: 
        { 
          
        } 
      }, function(err, res) {
      // console.log(req.body.companyAddress);
    });
  });

  app.listen(3000, () => console.log('Server started on port 3000'));
});