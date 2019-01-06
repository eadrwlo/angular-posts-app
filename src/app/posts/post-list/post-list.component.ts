import { Component, Input } from '@angular/core';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  posts = [
    {title : 'Fisrt Post', content: 'This is the first post!', imgUrl : 'https://cdn131.picsart.com/280243461051201.jpg?c256x256'},
    // tslint:disable-next-line:max-line-length
    {title : 'Second Post', content: 'This is the first post!', imgUrl : 'https://www.nocoastbestcoast.com/images/lost-forty-chippewa-national-forest-2.jpg'},
    {title : 'Third Post', content: 'This is the first post!', imgUrl : 'http://www.odessakelley.com/_Media/footprints_hr.jpeg'},
    {title : 'Fourth Post', content: 'This is the first post!', imgUrl : 'http://www.odessakelley.com/_Media/footprints_hr.jpeg'}
  ];
  @Input() posts2 = [];
  text = 'Hej!';
}
