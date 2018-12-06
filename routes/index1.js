require('dotenv').config();
var fs = require("fs");
var path = require('path');
var request = require('request');
var textract = require('textract');
var sppull = require("sppull").sppull;
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var https = require ('https');

var url = require('url');
var juice = require('juice');
const sgMail = require('@sendgrid/mail');

var Linkedin = require('node-linkedin')('81yooy0fgqgwnd', 'cuDmW9pn0HM3dwCN', 'http://localhost:3000/callback');

var express = require('express');
var router = express.Router();


var phrasecount = 10;
var sendgridCredentials = [];

//Muthuprasanth1012

/* GET home page. */


router.get('/callback', function(req, res, next) {

  console.log("code ",req.query.code);
  Linkedin.auth.getAccessToken(res, req.query.code, req.query.state, function(err, results) {
    if ( err )
    return console.error("error is ",err);

    /**
     * Results have something like:
     * {"expires_in":5184000,"access_token":". . . ."}
     */

    console.log("profile details ",results);
    //return res.redirect('http://localhost:3000/tasks');
  });
});

function getLinkedInDetails(req, res){

  // var luisserverurl = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=81yooy0fgqgwnd&"+
  //   "redirect_uri=http://localhost:3000/callback&state=cuDmW9pn0HM3dwCNsls90dsdh3dghs";
  // var options4 = {
  //   method: 'get',
  //   url:luisserverurl,
  // }

  // return new Promise(function (resolve, reject) {
  //   request(options4, function (err, result, body) {
  //     if(err)
  //     {
  //       console.log("error ",err);
  //       reject(err);

  //     }
  //    //let resultfromluis = JSON.parse(body);
  //     console.log("linkedin profile ",body);
  //     resolve(body);
  //   });
  // });
  console.log(" Getting getLinkedInDetails is");
  var scope = ['r_basicprofile', 'r_fullprofile', 'r_emailaddress', 'r_network', 'r_contactinfo', 'rw_nus', 'rw_groups', 'w_messages'];
  //Linkedin.setCallback(req.protocol + '://' + req.headers.host + '/callback');
  Linkedin.auth.authorize(res, scope);

}

router.get('/tasks', function(req, res, next) {
  console.log("ResumeScreening AI")
  
  let promiseTOGetsendgridCredentials = getLinkedInDetails(req, res);
  //promiseTOGetsendgridCredentials.then(function (Credentials) {
    //console.log(" Getting getLinkedInDetails is", Credentials);
  //}).catch(function (error) {
    //console.log("Error in Getting getLinkedInDetails is");
  //});
  //let promiseTOGetsendgridCredentials = getSendgrid(res);
  // promiseTOGetsendgridCredentials.then(function (Credentials) {
  //   sendgridCredentials[0] = Credentials[0];
  //   sendgridCredentials[1] = Credentials[1];
  //   res = Credentials[2];
  //   //console.log("sendgridCredentials is", sendgridCredentials);
  //   //sendMail(["mprasanth113@gmail.com"],res);
  // });
});

function getSendgrid(res) {
  
  var config =
  {
    userName: 'Muthuprasanth038', 
    password: 'Sirius@25', 
    server: 'sendgridcredentials.database.windows.net', 
    options:
    {
      database: 'Sendgridcred1', 
      encrypt: true
    }
  }

  var connection = new Connection(config);
  
  var i = 0;
  return new Promise(function (resolve, reject) {
   connection.on('connect', function (err) {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        let tediousRequest = new Request(
          "SELECT  username,sendkey FROM dbo.userdetails",
          function (err, rowCount, rows) {
            sendgridCredentials[2] = res;
            resolve(sendgridCredentials);
          }
        );
        tediousRequest.on('row', function (columns) {
          columns.forEach(function (column) {
            sendgridCredentials[i] = column.value;
            i++;
          });

        });
        connection.execSql(tediousRequest);
      }
    });
 
  });
}


function sendMail(emails,response)
{
  console.log("email username and password",sendgridCredentials[0],sendgridCredentials[1]);
 /* var sendgrid = new Sendgrid({
    user: sendgridCredentials[0],//provide the login credentials
    key:sendgridCredentials[1]
  });*/
  sgMail.setApiKey(sendgridCredentials[1]);

  let htmlstart="<!DOCTYPE html> <html><head><style> body {padding:10px; }"
  + ".sign{ width:1.7812in;height:0.6145in; }.hrname{margin:10px 0 0 0} .phone{color:rgb(102, 102, 102);margin:0} .web{color:rgb(48, 74, 134);} .line{margin:0 5px;} .email{color:#0000FF} </style></head><body>";
  let htmlend  = "</body></html>";
  let content = "<span> Hi, </span> <br><br> <span>Greetings from Sirius India !!</span><br>"+       
  "<p>Thank you for your interest with Sirius Computer Solutions. You have been shortlisted for <b>.NET and Azure Developer</b>. Your next round is Technical Interview with our Hiring-Bot.</p>"+
  "<p><b>Please follow the below instructions to start your Interview</b></p>"+
  "<ol>"+
      "<li>Signup/Login with Skype</li>"+
     "<li>Click<a href='https://join.skype.com/bot/ec47385e-f2db-4df7-9d3b-c5f9f767bd43'> Here</a> to start nterview</li>"+
     "<li>Once the chat window opens, say <b>Hi</b></li>"+
  "</ol>"+
  "<div><img src='https://image.ibb.co/grmLHo/sirius_Logo_Mail.png'  alt='no image found' class='sign'/></div><h4 class = 'hrname'>Human Resources</h4><p class='phone'>Office (India): +91 44 6650 7800 </p>"+
  "<span><a href='http://www.siriuscom.com' class = 'web'>www.siriuscom.com</a></span><span class='line'>|</span><span class='email'>Sirius.IndiaHR@siriuscom.com</span>";
  // "<p><a href='https://join.skype.com/bot/9c011e01-a307-4aa5-b9a6-13b3b5df47d1'>Click me</a> for the next round of Interview</p> <br><br>" +
  // "<img src='cid:testme' alt='graphic'/>";
  //https://join.skype.com/bot/b23753fe-a695-4f1c-a94a-86fc3a0eb8c8
  //+"<img src = 'data:image/png;base64,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'/>";
  let response1 = htmlstart+ content + htmlend;
  let response2 =  juice(response1);
  console.log(" response2 = ",response2);
  sgMail.send({
      to:'mprasanthmurugesan@gmail.com',
      from: 'mprasanthmurugesan@gmail.com',
    //   cc:"sendgriduser112@gmail.com",
      subject: 'Interview from Sirius Computer Solutions India Pvt Ltd ',

      html: response2,    
      // "<a href='https://join.skype.com/bot/3935f689-309f-4bea-a782-dd4fdce254b4'>Click me</a>",

  }, function (err) {
    if (err) {
      response.json({ message: 'Selected but Mail not sended and Error is'+err });
      console.log("Mail error",err);
   
    } else {
      console.log("Success Mail sended From Azure ");
      response.json({ message: 'Selected and Mail sended' });
    }
  });
}

module.exports = router;
