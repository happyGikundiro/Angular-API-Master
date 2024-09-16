import { Component, Input, OnInit } from '@angular/core';
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
  @Input() postId!: number; // Add this line
  postForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private postService: PostsService,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.postId) {
      this.postService.getPost(this.postId).subscribe((post: Post) => {
        this.postForm.patchValue(post);
      });
    }
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      this.postService.updatePost(this.postId, this.postForm.value).subscribe(() => {
        alert('Post updated successfully!');
        this.router.navigate(['/posts']);
      });
    }
  }
}
