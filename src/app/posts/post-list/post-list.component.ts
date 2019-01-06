import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts = [
    {title : 'Fisrt Post', content: 'This is the first post!', imgUrl : 'https://cdn131.picsart.com/280243461051201.jpg?c256x256'},
    // tslint:disable-next-line:max-line-length
    {title : 'Second Post', content: 'This is the first post!', imgUrl : 'https://www.nocoastbestcoast.com/images/lost-forty-chippewa-national-forest-2.jpg'},
    {title : 'Third Post', content: 'This is the first post!', imgUrl : 'http://www.odessakelley.com/_Media/footprints_hr.jpeg'},
    {title : 'Fourth Post', content: 'This is the first post!', imgUrl : 'http://www.odessakelley.com/_Media/footprints_hr.jpeg'}
  ];
  posts2 = [];
  private postsSub: Subscription;
  constructor(public postsService: PostsService){}
  ngOnInit() {
    //this.posts2 = this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts2 = posts;
      });
  }

  ngOnDestoy() {
    this.postsSub.unsubscribe();
  }
}
