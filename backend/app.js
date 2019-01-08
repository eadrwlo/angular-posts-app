const express = require ('express');
const app = express();
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
AWS.config.loadFromPath('./config.json');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

app.use((req, res, next) => {
  console.log('Received req in common/');
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.use('/api/posts' , (req, res, next) => {
  console.log('Received req in posts');
  const posts = [
    { id: 'asdasdasd11', title: 'Photo1', content: 'Wood', imageUrl: 'https://s3.us-east-2.amazonaws.com/photo-rotator-storage/photos/wood.jpg', imageName: 'wood.jpg'},
    { id: 'asdasdasd12', title: 'Photo2', content: 'Sea', imageUrl: 'https://s3.us-east-2.amazonaws.com/photo-rotator-storage/photos/sea.jpg', imageName: 'wood.jpg'},
    { id: 'asdasdasd13', title: 'Photo3', content: 'Forest', imageUrl: 'https://s3.us-east-2.amazonaws.com/photo-rotator-storage/photos/forest.jpg', imageName: 'wood.jpg'},
    { id: 'asdasdasd14', title: 'Photo4', content: 'Mountain', imageUrl: 'https://s3.us-east-2.amazonaws.com/photo-rotator-storage/photos/mountain.jpg', imageName: 'wood.jpg'}
  ];
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
    QueueUrl: "https://sqs.us-east-2.amazonaws.com/856630134260/Test.fifo",
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
