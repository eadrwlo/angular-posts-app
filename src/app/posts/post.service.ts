import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class PostsService {

  // Properties
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {

  }
  // ec2-18-218-10-23.us-east-2.compute.amazonaws.com
  // Methods
  getPosts() {
    this.http.get<{message: string, posts: Post[]}>('http://ec2-18-218-10-23.us-east-2.compute.amazonaws.com:3000/api/posts')
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
}
