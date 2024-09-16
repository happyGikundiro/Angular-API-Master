import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../../services/posts/posts.service';
import { Comment, Post } from '../../model/model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit, OnDestroy {

  post: Post = {
    userId: 0,
    id: 0,
    title: '',
    body: ''
  };
  comments: Comment[] = [];
  isLoading = true;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private postService: PostsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    
    if (postId) {
      const postSubscription = this.postService.getPost(+postId).subscribe((post) => {
        this.post = post;
        this.checkLoadingStatus();
      });
  
      const commentsSubscription = this.postService.getCommentsForPost(+postId).subscribe((comments) => {
        this.comments = comments;
        this.checkLoadingStatus();
      });

      this.subscriptions.add(postSubscription);
      this.subscriptions.add(commentsSubscription);
    } else {
      console.error('Post ID is null');
      this.isLoading = false;
    }
  }

  checkLoadingStatus(): void {
    if (this.comments.length > 0 && this.post.title) {
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

}
