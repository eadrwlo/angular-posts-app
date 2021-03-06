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
    { id: 'asdasdasd12', title: 'First serv post', content: 'First post content'},
    { id: 'asdasdasd12', title: 'Second serv post', content: 'Second post content'},
  ];
  res.status(200).json({
    message: 'Post fetched successfully',
    posts: posts
  });
});

module.exports = app;
