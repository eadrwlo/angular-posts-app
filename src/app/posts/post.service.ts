import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostsService {

  // Properties
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  // Methods
  getPosts() {
    return [...this.posts];
  }

  addPost(title: string, content: string) {
    const post: Post = {title: title, content: content};
    this.posts.push(post);
    this.postUpdated.next([...this.posts]);
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }
}
