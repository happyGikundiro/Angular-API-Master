import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPostComponent } from './edit-post.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PostsService } from '../../services/posts/posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Post } from '../../model/model';
import { RouterTestingModule } from '@angular/router/testing';

describe('EditPostComponent', () => {
  let component: EditPostComponent;
  let fixture: ComponentFixture<EditPostComponent>;
  let mockPostsService: any;
  let mockActivatedRoute: any;
  let mockRouter: any;

  beforeAll(() => {
    global.alert = jest.fn();
  });

  afterAll(() => {
    global.alert = window.alert;
  });

  beforeEach(async () => {
    mockPostsService = {
      getPost: jest.fn(),
      updatePost: jest.fn()
    };

    mockActivatedRoute = {
      params: of({ id: 1 })
    };

    mockRouter = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [EditPostComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        FormBuilder,
        { provide: PostsService, useValue: mockPostsService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPostComponent);
    component = fixture.componentInstance;

    const mockPost: Post = {
      id: 1,
      userId: 1,
      title: 'Test Post',
      body: 'Test body'
    };

    mockPostsService.getPost.mockReturnValue(of(mockPost));
    
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch post data and update the form on init', () => {
    expect(mockPostsService.getPost).toHaveBeenCalledWith(1);
    expect(component.postForm.value).toEqual({
      id: 1,
      title: 'Test Post',
      body: 'Test body'
    });
  });

  it('should not submit the form if invalid', () => {
    component.postForm.patchValue({ title: '', body: '' });
    component.onSubmit();
    expect(mockPostsService.updatePost).not.toHaveBeenCalled();
  });

  it('should submit the form and update the post if valid', () => {
    component.postForm.patchValue({ title: 'Updated Post', body: 'Updated body' });

    mockPostsService.updatePost.mockReturnValue(of({}));

    component.onSubmit();

    expect(mockPostsService.updatePost).toHaveBeenCalledWith(1, {
      id: 1,
      userId: 1,
      title: 'Updated Post',
      body: 'Updated body'
    });

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
