import { Component } from '@angular/core';
import { PostsService } from '../../services/posts/posts.service';
import { Post } from '../../model/model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.css'
})
export class PostsComponent {

  posts: Post[] = [];
  currentPage: number = 1;
  totalPages: number = 10;
  isFormVisible = false;
  selectedPostId?: number;

  constructor(private postService: PostsService, private router: Router) {}

  ngOnInit(): void {
    this.fetchPosts(this.currentPage);
  }

  fetchPosts(page: number): void {
    this.postService.getPosts(page, 10).subscribe(
      (posts) => {
        this.posts = posts;
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }

  openForm(postId?: number): void {
    this.selectedPostId = postId;
    this.isFormVisible = true;
  }

  closeForm(): void {
    this.isFormVisible = false;
    this.selectedPostId = undefined;
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
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(id).subscribe(() => {
        alert('Post deleted successfully!');
        this.fetchPosts(this.currentPage);
      });
    }
  }

}
