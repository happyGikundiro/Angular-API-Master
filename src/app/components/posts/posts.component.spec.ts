import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostsComponent } from './posts.component';
import { PostsService } from '../../services/posts/posts.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Post } from '../../model/model';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;
  let mockPostsService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockPostsService = {
      getPosts: jest.fn(),
      deletePost: jest.fn()
    };

    mockRouter = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [PostsComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: PostsService, useValue: mockPostsService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;

    const mockPosts: Post[] = [
      { userId: 1, id: 1, title: 'Post 1', body: 'Body 1' },
      { userId: 2, id: 2, title: 'Post 2', body: 'Body 2' }
    ];

    mockPostsService.getPosts.mockReturnValue(of(mockPosts));
    mockPostsService.deletePost.mockReturnValue(of({}));

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch posts on init', () => {
    expect(mockPostsService.getPosts).toHaveBeenCalledWith(1, 10);
    expect(component.posts).toEqual([
      { userId: 1, id: 1, title: 'Post 1', body: 'Body 1' },
      { userId: 2, id: 2, title: 'Post 2', body: 'Body 2' }
    ]);
    expect(component.isLoading).toBe(false);
  });

  it('should handle errors when fetching posts', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockPostsService.getPosts.mockReturnValue(throwError(() => new Error('Fetch error')));
    
    component.fetchPosts(1);
    
    expect(component.isLoading).toBe(false);
    consoleErrorSpy.mockRestore();
  });

  it('should toggle form visibility', () => {
    component.openForm();
    expect(component.isFormVisible).toBe(true);

    component.closeForm();
    expect(component.isFormVisible).toBe(false);
  });

  it('should change page and fetch new posts', () => {
    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
    expect(mockPostsService.getPosts).toHaveBeenCalledWith(2, 10);
  });

  it('should navigate to post detail view on viewPost', () => {
    component.viewPost(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/post', 1]);
  });

  it('should navigate to post edit view on editPost', () => {
    component.editPost(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/post/edit', 1]);
  });

  it('should delete a post and refresh posts list', () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    component.deletePost(1);
    
    expect(mockPostsService.deletePost).toHaveBeenCalledWith(1);
    expect(mockPostsService.getPosts).toHaveBeenCalledWith(1, 10);
    alertSpy.mockRestore();
  });

  it('should clean up subscriptions on destroy', () => {
    const unsubscribeSpy = jest.spyOn(component['subscriptions'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
