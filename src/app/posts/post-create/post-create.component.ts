import { Component, AfterViewInit } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from '../post.service';
import { s3 } from 'fine-uploader/lib/core/s3';

@Component({
  selector: 'app-post-create',
  templateUrl: 'post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreatorComponent implements AfterViewInit {

  selectedFiles: FileList;
  enteredContent = '';
  enteredTitle = '';

  bucketName = 'image-bucket-polibuda';
  uploader: any;

  constructor(public postService: PostsService) {}

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.postService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }

  upload() {
    const file = this.selectedFiles.item(0);
    this.postService.uploadfile(file);
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  //Sending file to S3
  ngAfterViewInit() {
    console.log('ngAfterViewInit() called!');
    const instance = this;
    console.log('instance.bucketName' + instance.bucketName);
    this.uploader = new s3.FineUploaderBasic({
      button: document.getElementById('upload_image'),
      debug: false,
      autoUpload: true,
      multiple: true,
      validation: {
        allowedExtensions: ['jpeg', 'jpg', 'png', 'gif', 'svg'],
        sizeLimit: 5120000 // 50 kB = 50 * 1024 bytes
      },

      request: {
        endpoint: 'https://' + instance.bucketName  + '.s3.amazonaws.com',
        accessKey: 'AKIAIEFQXZU4DRMP2NTA'
      },
      signature: {
        version : 4,
        endpoint: 'http://localhost:3000/api/getsignature',
      },

      uploadSuccess: {
        endpoint: 'http://localhost:3000/api/newfile'
      },


      cors: {
        expected : true,
        sendCredentials: true
      },

      objectProperties: {
        region: 'us-east-2'
      },

      callbacks: {
        onSubmit: function (id, fileName) {
          console.log('selected file:', fileName);
        },
        // onSubmitted: function(id, name) { alert('onSubmitted');},
        onComplete: function (id, name, responseJSON, maybeXhr) {
          if (responseJSON.success) {
            console.log('upload complete', name);
            console.log('uploaded image url', 'https://' + instance.bucketName + '.s3.amazonaws.com/' + this.getKey(id));
          }
        },
      }
    });
  }
}
