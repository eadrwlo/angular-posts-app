const express = require ('express');
const app = express();
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const path = require('path');
var async = require("async");
const CryptoJS = require("crypto-js");
const uuidv1 = require('uuid/v1');
AWS.config.loadFromPath('./config.json');
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
AWS.config.setPromisesDependency();
const s3Handler = require('./s3-handler-module');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use("/images", express.static(path.join("backend/images")));


app.use((req, res, next) => {
  console.log('Received req in common/');
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Cache-Control", "private, max-age=31536000, must-revalidate");
  next();
});

app.use('/api/filetest', async (req, res, next) => {
  console.log('Received req in api/filetests');
  let fileList = await s3Handler.getObjectList(s3);
  console.log('fileList = ' + JSON.stringify(fileList));
  res.status(201).json({
  message: 'Got object!',
  fileList: fileList
  });

  next();
});

////s3.us-east-2.amazonaws.com/photo-rotator-storage/photos/wood.jpg
app.use('/api/posts' , async (req, res, next) => {
  console.log('Received req in posts');
  //await s3Handler.downloadFile(s3, '2.jpg');
  posts = [];
  var i = 1;
  let fileList = await s3Handler.getObjectList(s3);
  const backetUrl = 'https://s3.us-east-2.amazonaws.com/image-bucket-polibuda/';
  const url = req.protocol + '://' + req.get("host") + "/images/";
  console.log('url= ' + url);

  console.log('After file download!');
   fileList.forEach( element => {
    console.log('element = ', element);
    posts.push({ id: 'id-' + i, title: 'Photo' + i, content: 'Random text...', imageUrl: backetUrl + element, imageName: element});
    i++;
  });
  console.log('posts' + posts);
  res.status(200).json({
    message: 'Post fetched successfully',
    posts: posts
  });
  console.log('res sent!');
  next();
});

app.post('/api/rotate' , async (req, res, next) => {
  console.log('Received req in rotate');
  const data = req.body;
  const imgToRotate = JSON.stringify(data);
  console.log('Received data = ' + imgToRotate);
  res.status(201).json({
    message: 'Rotate command received succesfully'
  });

  if(imgToRotate)
  {
    const params = {
    //MessageAttributes: { imgToRotate },
    MessageBody: imgToRotate,
    QueueUrl: "https://sqs.us-east-2.amazonaws.com/669871437165/MyTestQueue.fifo",
    MessageGroupId: "rotateRequests",
    MessageDeduplicationId: uuidv1()
    };
    sqs.sendMessage(params, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success sent to queue!", data.MessageId);
      }
    });
  }
  next();
});

app.post('/api/newfile' , async (req, res, next) => {
  console.log('Received req in newfile');
  const data = req.body;
  const jsonData = JSON.stringify(data);
  console.log('jsonData= ' + jsonData);
  imageName = data.key;
  console.log('imageName= ' + imageName);
  await s3Handler.downloadFileV2(s3, imageName);
  msg = 'Downloaded ' + "imageName" + ' to server',
  res.status(201).json({
    message: msg,
  });
  next();
});

//serverPublicKey = 'AKIAI3DII2YH6ZAHBRLQ'
clientSecretKey = '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';
expectedBucket = 'image-bucket-polibuda';
app.post('/api/getsignature', (req, res, next) => {
  const data = req.body;
  const jsonData = JSON.stringify(data);
  console.log('Received in /api/getsignature = ' + jsonData);
  signPolicy(req, res);
});

function signPolicy(req, res) {
  var policy = req.body,
      base64Policy = new Buffer(JSON.stringify(policy)).toString("base64"),
      signature = req.query.v4 ? signV4Policy(policy, base64Policy) : signV2Policy(base64Policy);


  var jsonResponse = {
      policy: base64Policy,
      signature: signature
  };

  res.setHeader("Content-Type", "application/json");

  if (isPolicyValid(req.body)) {
      res.end(JSON.stringify(jsonResponse));
  }
  else {
      res.status(400);
      res.end(JSON.stringify({invalid: true}));
  }
}

function signV2Policy(base64Policy) {
  return getV2SignatureKey(clientSecretKey, base64Policy);
}

function getV2SignatureKey(key, stringToSign) {
  var words = CryptoJS.HmacSHA1(stringToSign, key);
  return CryptoJS.enc.Base64.stringify(words);
}

function signV4Policy(policy, base64Policy) {
  var conditions = policy.conditions,
      credentialCondition;

  for (var i = 0; i < conditions.length; i++) {
      credentialCondition = conditions[i]["x-amz-credential"];
      if (credentialCondition != null) {
          break;
      }
  }

  var matches = /.+\/(.+)\/(.+)\/s3\/aws4_request/.exec(credentialCondition);
  return getV4SignatureKey(clientSecretKey, matches[1], matches[2], "s3", base64Policy);
}

function getV4SignatureKey(key, dateStamp, regionName, serviceName, stringToSign) {
  var kDate = CryptoJS.HmacSHA256(dateStamp, "AWS4" + key),
      kRegion = CryptoJS.HmacSHA256(regionName, kDate),
      kService = CryptoJS.HmacSHA256(serviceName, kRegion),
      kSigning = CryptoJS.HmacSHA256("aws4_request", kService);

  return CryptoJS.HmacSHA256(stringToSign, kSigning).toString();
}

function isPolicyValid(policy) {
  var bucket, parsedMaxSize, parsedMinSize, isValid;

  policy.conditions.forEach(function(condition) {
      if (condition.bucket) {
          bucket = condition.bucket;
      }
      else if (condition instanceof Array && condition[0] === "content-length-range") {
          parsedMinSize = condition[1];
          parsedMaxSize = condition[2];
      }
  });

  isValid = bucket === expectedBucket;
  console.log('isValid = ' + isValid);
  // If expectedMinSize and expectedMax size are not null (see above), then
  // ensure that the client and server have agreed upon the exact same
  // values.
  // if (expectedMinSize != null && expectedMaxSize != null) {
  //     isValid = isValid && (parsedMinSize === expectedMinSize.toString())
  //         && (parsedMaxSize === expectedMaxSize.toString());
  // }

  return isValid;
}
module.exports = app;
