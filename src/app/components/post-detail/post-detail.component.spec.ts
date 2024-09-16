import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostDetailComponent } from './post-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../../services/posts/posts.service';
import { of } from 'rxjs';
import { Post, Comment } from '../../model/model';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PostDetailComponent', () => {
  let component: PostDetailComponent;
  let fixture: ComponentFixture<PostDetailComponent>;
  let mockPostsService: any;
  let mockActivatedRoute: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockPostsService = {
      getPost: jest.fn(),
      getCommentsForPost: jest.fn()
    };

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn()
        }
      }
    };

    mockRouter = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [PostDetailComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: PostsService, useValue: mockPostsService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostDetailComponent);
    component = fixture.componentInstance;

    const mockPost: Post = {
      userId: 1,
      id: 1,
      title: 'Test Post',
      body: 'Test body'
    };
    const mockComments: Comment[] = [
      { id: 1, postId: 1, name: 'Commenter', email: 'commenter@example.com', body: 'Great post!' }
    ];

    mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('1');
    mockPostsService.getPost.mockReturnValue(of(mockPost));
    mockPostsService.getCommentsForPost.mockReturnValue(of(mockComments));

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch post and comments on init', () => {
    expect(mockPostsService.getPost).toHaveBeenCalledWith(1);
    expect(mockPostsService.getCommentsForPost).toHaveBeenCalledWith(1);
    expect(component.post).toEqual({
      userId: 1,
      id: 1,
      title: 'Test Post',
      body: 'Test body'
    });
    expect(component.comments).toEqual([
      { id: 1, postId: 1, name: 'Commenter', email: 'commenter@example.com', body: 'Great post!' }
    ]);
    expect(component.isLoading).toBe(false);
  });

  it('should handle null post ID gracefully', () => {
    mockActivatedRoute.snapshot.paramMap.get.mockReturnValue(null);
    fixture.detectChanges();
    expect(component.isLoading).toBe(false);
  });

  it('should clean up subscriptions on destroy', () => {
    const unsubscribeSpy = jest.spyOn(component['subscriptions'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
