import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../post.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Component ({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];
  posts: Post[] = [];
  posts3: any;
  new: any;
  private postsSub: Subscription;
  readonly URL = 'http://localhost:3000/api/';
  //readonly URL = 'http://ec2-18-218-10-23.us-east-2.compute.amazonaws.com:3000/api/';

  constructor(public postsService: PostsService,
    private http: HttpClient) {}

  ngOnInit() {
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  sendRotateReq(imageName: String) {
    //const headers = new HttpHeaders().set('Content-Type', 'application/json'/*'multipart/form-data'*/);
    const data = {
      operation : 'rotate',
      imageName : imageName
    };
    this.http.post(this.URL + 'rotate', data).subscribe((res) => {
      console.log(res);
    });
  }

}
