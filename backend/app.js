const express = require ('express');

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Header", "Origin, X-Request-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.use('/api/posts' , (req, res, next) => {
  const posts = [
    { id: 'asdasdasd11', title: 'Photo1', content: 'Wood', imageUrl: 'https://s3.us-east-2.amazonaws.com/photo-rotator-storage/photos/wood.jpg'},
    { id: 'asdasdasd12', title: 'Photo2', content: 'Sea', imageUrl: 'https://s3.us-east-2.amazonaws.com/photo-rotator-storage/photos/sea.jpg'},
    { id: 'asdasdasd13', title: 'Photo3', content: 'Forest', imageUrl: 'https://s3.us-east-2.amazonaws.com/photo-rotator-storage/photos/forest.jpg'},
    { id: 'asdasdasd14', title: 'Photo4', content: 'Mountain', imageUrl: 'https://s3.us-east-2.amazonaws.com/photo-rotator-storage/photos/mountain.jpg'}
  ];
  res.status(200).json({
    message: 'Post fetched successfully',
    posts: posts
  });
});

module.exports = app;
