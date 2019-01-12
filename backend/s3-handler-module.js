var bucketCfg = {
  Bucket: 'image-bucket-polibuda',
  Prefix : ''
};


exports.myDateTime = function () {
  return Date();
};

exports.printObjectList = function (s3Ref) {
  s3Ref.listObjects(bucketCfg, function(err, data) {
    if (err) {
        return 'There was an error viewing your album: '
        + err.message
    } else {
        console.log(data.Contents,"<<<all content");
        data.Contents.forEach(function(obj,index){
            console.log(obj.Key, "<<<file path");
        })
      }
  })
};

exports.getObjectList = async function (s3Ref) {
  fileList = [];
  let response = await s3Ref.listObjectsV2(bucketCfg).promise();
  response.Contents.forEach(function(obj,index){
    console.log('File =' + obj.Key);
    fileList.push(obj.Key);
  })
  return fileList;
}

exports.downloadFile = function () {
    // var params = {
  //   Bucket: 'image-bucket-polibuda',
  //   Key : '1.jpg'
  // };

//   file = FS.createWriteStream("file.jpg");
//   res.attachment('1.jpg');
//   s3.getObject(params)
//   .on('error', function (err) {
//     console.log(err);
//   })
//   .on('httpData', function (chunk) {
//       file.write(chunk);
//   })
//   .on('httpDone', function () {
//       file.end();
//   })
//   .send();
//   res.writeHead(200, {
//     'Content-Type': 'image/jpg',
//     'Content-Length': 54272
// });
//   stream = s3.getObject(params).createReadStream();
//   stream.pipe(res);
  // res.status(201).json({
  //   message: 'Rotate command received succesfully'
  // });
}



