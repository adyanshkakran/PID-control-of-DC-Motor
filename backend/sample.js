const JSONdb = require('simple-json-db');
const db = new JSONdb('./UserCreds.json');
const loginTimedb = new JSONdb('./UserLoginTime.json');
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

const PORT = process.env.PORT || 3000;
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
  res.sendFile(__dirname+ '/static/index.html');
});

app.get('/static/sign_in/index.html',(req,res)=>
{
  res.sendFile(__dirname+ '/static/sign_in/index.html');
});

app.get('/static/sign_in/style.css',(req,res)=>
{
  res.sendFile(__dirname+ '/static/sign_in/style.css');
});

app.get('/static/sign_up/index.html',(req,res)=>
{
  res.sendFile(__dirname+ '/static/sign_up/index.html');
});

app.get('/static/sign_up/style.css',(req,res)=>
{
  res.sendFile(__dirname+ '/static/sign_up/style.css');
});

app.get('/static/scripts.js',(req,res)=>
{
  res.sendFile(__dirname+ '/static/scripts.js');
});

app.get('/static/style.css',(req,res)=>
{
  res.sendFile(__dirname+ '/static/style.css');
});

app.get('/static/vanta.net.min.js',(req,res)=>
{
  res.sendFile(__dirname+ '/static/vanta.net.min.js');
});

app.get('/static/index.html',(req,res)=>
{
  res.sendFile(__dirname+ '/static/index.html');
});

app.get('/static/experiment/index.html',(req,res)=>
{
  const cookies=parseCookies(req);
  const user=cookies['name'];
  if(user=="no user loginned")
  {
    res.redirect("/");
  }
  else
    res.sendFile(__dirname+ '/static/experiment/index.html');
});

app.get('/static/experiment/style.css',(req,res)=>
{
  res.sendFile(__dirname+ '/static/experiment/style.css');
});

app.get('/static/experiment/scripts.js',(req,res)=>
{
  res.sendFile(__dirname+ '/static/experiment/scripts.js');
});

app.get('/static/experiments_page/index.html',(req,res)=>
{
  const cookies=parseCookies(req);
  const user=cookies['name'];
  if(user=="no user loginned")
  {
    res.redirect("/");
  }
  else
    res.sendFile(__dirname+ '/static/experiments_page/index.html');
});

app.get('/static/experiments_page/style.css',(req,res)=>
{
  res.sendFile(__dirname+ '/static/experiments_page/style.css');
});

app.get('/static/experiments_page/scripts.js',(req,res)=>
{
  res.sendFile(__dirname+ '/static/experiments_page/scripts.js');
});

app.get('/static/experiment_theory/index.html',(req,res)=>
{
  const cookies=parseCookies(req);
  const user=cookies['name'];
  if(user=="no user loginned")
  {
    res.redirect("/");
  }
  else
    res.sendFile(__dirname+ '/static/experiment_theory/index.html');
});

app.get('/static/experiment_theory/style.css',(req,res)=>
{
  res.sendFile(__dirname+ '/static/experiment_theory/style.css');
});

app.get('/static/experiment_theory/scripts.js',(req,res)=>
{
  res.sendFile(__dirname+ '/static/experiment_theory/scripts.js');
});

app.get('/getTimeSpent',(req,res)=>
{
  const cur=Date.now();
  const cookies=parseCookies(req);
  const user=cookies['name'];
  if(user=="no user loginned")
  {
    res.send("0");
  }
  else
  {
    res.send((((cur-loginTimedb.get(user)))/1000).toString());
  }
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
//
app.get("/login",function (req, res)
{
  const cookies=parseCookies(req);
  const user=cookies['name'];
  if(user=="no user loginned")
  {
    res.redirect("/static/sign_in/index.html");
  }
  else 
  {
    res.redirect("/static/experiments_page/index.html");
  }

});

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
        loginTimedb.set(givenUsername,Date.now());
        res.redirect("/static/experiments_page/index.html");
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

app.get('/getGraph', function(req,res){
  res.redirect("https://thingspeak.com/channels/1764340/charts/1?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line");
}); 

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
    res.redirect("/");
    //res.sendFile(__dirname+ '/static/sign_in/index.html');
    db.set(givenUsername,password);
  }
  else 
  {
    console.log("there");
    res.redirect("/");
    // res.sendFile(__dirname+ '/static/sign_in/index.html');
    // res.send("not done"); //not done
  }
});

app.get('/logout', function(req,res){
  console.log("hey");
  res.cookie('name', "no user loginned");
  res.redirect("/");
}); 

//it just tells us which user is loginned
//used for debugging

//starting our server

app.listen(PORT, function () {
    console.log(`Server is running on localhost:${PORT}`);
});
