import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../../services/posts/posts.service';
import { Post } from '../../model/model';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.css'
})
export class EditPostComponent implements OnInit {
  postForm: FormGroup;
  postId!: number;
  userId!: number;

  constructor(
    private fb: FormBuilder,
    private postService: PostsService,
    private route: ActivatedRoute, 
    private router: Router
  ) {
    this.postForm = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      body: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.postId = +params['id'];
      this.fetchPostData();
    });
  }

  fetchPostData(): void {
    this.postService.getPost(this.postId).subscribe((post: Post) => {
      if (post) {
        this.userId = post.userId;

        this.postForm.patchValue({
          id: this.postId,
          title: post.title,
          body: post.body
        });
      }
    });
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      const updatedPost: Post = {
        id: this.postId,
        userId: this.userId,
        title: this.postForm.value.title,
        body: this.postForm.value.body
      };

      this.postService.updatePost(this.postId, updatedPost).subscribe(() => {
        alert('Post updated successfully!');
        this.router.navigate(['/']);
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
