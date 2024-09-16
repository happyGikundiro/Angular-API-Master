import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostsService } from '../../services/posts/posts.service';
import { Post } from '../../model/model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  currentPage: number = 1;
  totalPages: number = 10;
  isFormVisible: boolean = false;
  isLoading: boolean = true;

  private subscriptions: Subscription = new Subscription();

  constructor(private postService: PostsService, private router: Router) {}

  ngOnInit(): void {
    this.fetchPosts(this.currentPage);
  }

  fetchPosts(page: number): void {
    const postSubscription = this.postService.getPosts(page, 10).subscribe(
      (posts) => {
        this.posts = posts;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching posts:', error);
        this.isLoading = false;
      }
    );

    this.subscriptions.add(postSubscription);
  }

  openForm(): void {
    this.isFormVisible = true;
  }

  closeForm(): void {
    this.isFormVisible = false;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchPosts(this.currentPage);
  }

  viewPost(id: number): void {
    this.router.navigate(['/post', id]);
  }
  
  editPost(id: number): void {
    this.router.navigate(['/post/edit', id]);
  }
  
  deletePost(id: number): void {
    const deleteSubscription = this.postService.deletePost(id).subscribe(() => {
      alert('Post deleted successfully!');
      this.fetchPosts(this.currentPage);
    });

    this.subscriptions.add(deleteSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
