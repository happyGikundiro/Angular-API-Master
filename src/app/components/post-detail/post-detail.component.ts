import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from '../../services/posts/posts.service';
import { Comment, Post } from '../../model/model';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent {

  post: Post = {
    userId: 0,
    id: 0,
    title: '',
    body: ''
  };
  comments: Comment[] = [];

  constructor(
    private route: ActivatedRoute,
    private postService: PostsService
  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    
    if (postId) {
      this.postService.getPost(+postId).subscribe((post) => {
        this.post = post;
      });
  
      this.postService.getCommentsForPost(+postId).subscribe((comments) => {
        this.comments = comments;
      });
    } else {
      console.error('Post ID is null');
    }
  }
  
}
