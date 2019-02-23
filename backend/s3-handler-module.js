const FS = require('fs');
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

exports.downloadFile = async function (s3Ref, fileName) {
    var bucketFileCfg = {
      Bucket: 'image-bucket-polibuda',
      Key : fileName
    };
    file = FS.createWriteStream('./backend/images/' + fileName);
    await s3Ref.getObject(bucketFileCfg)
    .on('error',  function (err) {
      console.log(err);
    })
    .on('httpData',  function (chunk) {
      file.write(chunk);
    })
    .on('httpDone',  function () {
      file.end();
        console.log('File downloaded!');
    }).send();
  }

  exports.downloadFileV2 = async function (s3Ref, fileName) {
    var bucketFileCfg = {
      Bucket: 'image-bucket-polibuda',
      Key : fileName
    };

    file = FS.createWriteStream('./backend/images/' + fileName);

    await s3Ref.getObject(bucketFileCfg).createReadStream().on('error', function(err){
      console.log(err);
    }).pipe(file);
    console.log('File downloaded, name = ' + bucketFileCfg.Key);
  }


