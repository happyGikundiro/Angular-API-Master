import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostsService } from '../../services/posts/posts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css' // Fixed typo: styleUrl -> styleUrls
})
export class AddPostComponent implements OnInit {
  postForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private postsService: PostsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.postForm = this.fb.group({
      userId: [1], // Default value for userId
      title: ['', Validators.required],
      body: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.postForm.valid) {
      this.postsService.createPost(this.postForm.value).subscribe(
        () => {
          alert('Post created successfully!');
          this.router.navigate(['/posts']);
        },
        (error) => {
          console.error('Error creating post:', error);
        }
      );
    }
  }
}
