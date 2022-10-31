const JSONdb = require('simple-json-db');
const db = new JSONdb('./UserCreds.json');

//for mailing
const nodemailer = require('nodemailer');

//for generating random password
var generator = require('generate-password');

//cookie session
var sessions = require('express-session');
const { ensureAuthenticated } = require('connect-ensure-authenticated');
cookieParser = require('cookie-parser');
const express = require("express");
var session;
const app = express();
const oneDay = 1000 * 60 * 60 * 24;
app.use(cookieParser());
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

app.use(express.urlencoded({ extended: true}));

app.use(express.json());


//static files 



app.get('/',(req,res)=>
{
 // console.log(req.sessionID);
  res.sendFile(__dirname+ '/static/index.html');
})
;app.get('/static/sign_in/index.html',(req,res)=>
{
 // console.log(req.sessionID);
  res.sendFile(__dirname+ '/static/sign_in/index.html');
});

app.get('/static/sign_in/style.css',(req,res)=>
{
 // console.log(req.sessionID);
  res.sendFile(__dirname+ '/static/sign_in/style.css');
});

app.get('/static/sign_in/index.html',(req,res)=>
{
 // console.log(req.sessionID);
  res.sendFile(__dirname+ '/static/sign_in/index.html');
});

app.get('/static/scripts.js',(req,res)=>
{
 // console.log(req.sessionID);
  res.sendFile(__dirname+ '/static/scripts.js');
});

app.get('/static/style.css',(req,res)=>
{
 // console.log(req.sessionID);
  res.sendFile(__dirname+ '/static/style.css');
});

app.get('/static/vanta.net.min.js',(req,res)=>
{
 // console.log(req.sessionID);
  res.sendFile(__dirname+ '/static/vanta.net.min.js');
});

app.get('/static/index.html',(req,res)=>
{
 // console.log(req.sessionID);
  res.sendFile(__dirname+ '/static/index.html');
});
//defining frontend apis
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});

//parse cookie function
function parseCookies (request) {
  const list = {};
  const cookieHeader = request.headers?.cookie;
  if (!cookieHeader) return list;
  cookieHeader.split(`;`).forEach(function(cookie) {
      let [ name, ...rest] = cookie.split(`=`);
      name = name?.trim();
      if (!name) return;
      const value = rest.join(`=`).trim();
      if (!value) return;
      list[name] = decodeURIComponent(value);
  });
  return list;
}

//debug if the cookie is set
app.get("/debug",function(req,res)
{
  const cookies=parseCookies(req);
  console.log(cookies['name']);
  res.send(cookies['name']);
});

//this checks the user creds and sets in cookie
app.post("/check",
function (req, res) {
  const givenUsername=req.body.username;
  const givenPassword=req.body.password;
  const actualPassword=db.get(givenUsername);
  console.log(req.body.username);
  if(givenPassword==actualPassword)
  {
      session=req.session;
      session.userid=req.body.username;
      console.log(session.userid);
      res.cookie('name', givenUsername);
      const cookies=parseCookies(req);
      console.log("lol");
      console.log(cookies['name']);
      res.send("correct password");
  }
  else
  {
      res.send("wrong password");
  }
});

//return  1 if successfully sent
//return -1 if there is an error
async function sendMailToUser(emailId,content)
{
  return new Promise((resolve,reject)=>{    
  const transporter = nodemailer.createTransport({
  port: 465,               // true for 465, false for other ports
  host: "smtp.gmail.com",
     auth: {
          user: 'zaidcoder@gmail.com',
          pass: 'bxmzigxhpndrqboj',
       },
  secure: true,
  });
  const mailData = {
    from: 'zaidcoder@gmail.com',  // sender address
      to: emailId,      // list of receivers
      subject: "password generated",
      text: content
    };
    transporter.sendMail(mailData, function (err, info) {
      if(err)
      {
        console.log(err);
        resolve(false); // or use rejcet(false) but then you will have to handle errors
      }
      else
      {
        console.log(info);
        resolve(true);
      }
   });
  });
} 

//this registers
app.post("/register",async function (req, res){
  const givenUsername=req.body.username;  //Body has username 
  console.log(givenUsername);
  const password = generator.generate({
    length: 10,
    numbers: true
  });
  console.log(password);
  ret = await sendMailToUser(req.body.username,password);
  if(ret==true)
  {
    console.log("here");
    res.sendFile(__dirname+ '/static/sign_in/index.html');
    db.set(givenUsername,password);
  }
  else 
  {
    console.log("there");
    res.sendFile(__dirname+ '/static/sign_in/index.html');
    // res.send("not done"); //not done
  }
});

app.get('/logout', function(req,res){
  res.cookie('name', "no user loginned");
  res.redirect("/");
}); 
//it just tells us which user is loginned
//used for debugging

//starting our server



app.listen(3000, function () {
    console.log("Server is running on localhost:3000");
});
