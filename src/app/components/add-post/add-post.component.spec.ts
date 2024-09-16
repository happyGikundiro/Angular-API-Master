import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AddPostComponent } from './add-post.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PostsService } from '../../services/posts/posts.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('AddPostComponent', () => {
  let component: AddPostComponent;
  let fixture: ComponentFixture<AddPostComponent>;
  let postsService: PostsService;
  let router: Router;

  beforeEach(async () => {
    const postsServiceMock = {
      createPost: jest.fn()
    };

    const routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [AddPostComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: PostsService, useValue: postsServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddPostComponent);
    component = fixture.componentInstance;
    postsService = TestBed.inject(PostsService);
    router = TestBed.inject(Router); 
    fixture.detectChanges();
  });

  it('should initialize the form with default values', () => {
    const postForm = component.postForm;
    expect(postForm).toBeDefined();
    expect(postForm.get('userId')?.value).toBe(1); 
    expect(postForm.get('title')?.value).toBe(''); 
    expect(postForm.get('body')?.value).toBe(''); 
  });

  it('should call createPost and navigate on successful submission', () => {
    component.postForm.setValue({
      userId: 1,
      title: 'Test Title',
      body: 'Test Body'
    });

    const mockPostResponse = of({});
    postsService.createPost = jest.fn().mockReturnValue(mockPostResponse);

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    component.onSubmit();

    expect(postsService.createPost).toHaveBeenCalledWith({
      userId: 1,
      title: 'Test Title',
      body: 'Test Body'
    });

    expect(alertSpy).toHaveBeenCalledWith('Post created successfully!');
    expect(router.navigate).toHaveBeenCalledWith(['']);
    alertSpy.mockRestore();
  });

  it('should log error on failed submission', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    component.postForm.setValue({
      userId: 1,
      title: 'Test Title',
      body: 'Test Body'
    });

    const mockErrorResponse = throwError(() => new Error('Test Error'));
    postsService.createPost = jest.fn().mockReturnValue(mockErrorResponse);

    component.onSubmit();

    expect(consoleSpy).toHaveBeenCalledWith('Error creating post:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  it('should not submit if form is invalid', () => {
    component.postForm.setValue({
      userId: 1,
      title: '',
      body: ''
    });

    component.onSubmit();

    expect(postsService.createPost).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
