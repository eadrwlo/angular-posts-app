import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as S3 from 'aws-sdk/clients/s3';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  private URL = 'http://localhost:3000/api/';

  constructor(private http: HttpClient) {
  }

  // ec2-18-218-10-23.us-east-2.compute.amazonaws.com
  // Methods
  getPosts() {
    this.http.get<{message: string, posts: Post[]}>(this.URL + 'posts')
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title: title, content: content, imageUrl: null, imageName: null};
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  //Not used now, secred key was needed
  //mthod from post-create.component is used
  async uploadfile(file) {
    const bucket = new S3(
      {
        accessKeyId: '',
        secretAccessKey: '',
        region: 'us-east-1'
      }
    );

    const params = {
      Bucket: 'image-bucket-polibuda',
      Key: file.name,
      Body: file
    };
    await bucket.upload(params, function (err, data) {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }
      console.log('Successfully uploaded file.', data);
    });

    const data2 = {
      imageName : file.name
    };
    this.http.post(this.URL + 'newfile', data2).subscribe((res) => {
      console.log(res);
    });
  }
}
