const express = require ('express');
const app = express();
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
const FS = require("fs");
AWS.config.loadFromPath('./config.json');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
AWS.config.setPromisesDependency();
const s3Handler = require('./s3-handler-module');

//console.log(s3Handler.myDateTime());

app.use((req, res, next) => {
  console.log('Received req in common/');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
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
  posts = [];
  var i = 1;
  let fileList = await s3Handler.getObjectList(s3);
  const backetUrl = 'https://s3.us-east-2.amazonaws.com/image-bucket-polibuda/';
  fileList.forEach(element => {
    posts.push({ id: 'id-' + i, title: 'Photo' + i, content: 'Random text...', imageUrl: backetUrl + element, imageName: element});
    i++;
  });

  res.status(200).json({
    message: 'Post fetched successfully',
    posts: posts
  });
  next();
});

app.use('/api/test' , (req, res, next) => {
  console.log('Received req in test');
  res.status(201).json({
    message: 'Rotate command received succesfully'
  });
  next();
});

app.post('/api/rotate' , (req, res, next) => {
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
});

module.exports = app;
