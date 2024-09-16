import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostsService } from './posts.service';
import { CacheService } from '../cache/cache.service';
import { Post } from '../../model/model';
import { environment } from '../../../environments/environment';

describe('PostsService', () => {
  let service: PostsService;
  let httpMock: HttpTestingController;
  let cacheService: CacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PostsService,
        { provide: CacheService, useValue: { get: jest.fn(), set: jest.fn() } }
      ]
    });

    service = TestBed.inject(PostsService);
    httpMock = TestBed.inject(HttpTestingController);
    cacheService = TestBed.inject(CacheService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPosts', () => {
    it('should return cached posts if available', () => {
      const cacheKey = 'posts-page-1-limit-10';
      const cachedPosts: Post[] = [
        { id: 1, userId: 1, title: 'Post 1', body: 'Body of post 1' },
        { id: 2, userId: 1, title: 'Post 2', body: 'Body of post 2' }
      ];

      jest.spyOn(cacheService, 'get').mockReturnValue(cachedPosts);

      service.getPosts(1, 10).subscribe(posts => {
        expect(posts).toEqual(cachedPosts);
      });

      expect(cacheService.get).toHaveBeenCalledWith(cacheKey);
    });

    it('should fetch posts from API if not cached', () => {
      const posts: Post[] = [
        { id: 1, userId: 1, title: 'Post 1', body: 'Body of post 1' },
        { id: 2, userId: 1, title: 'Post 2', body: 'Body of post 2' }
      ];
      const cacheKey = 'posts-page-1-limit-10';

      jest.spyOn(cacheService, 'get').mockReturnValue(null);
      jest.spyOn(cacheService, 'set');

      service.getPosts(1, 10).subscribe(fetchedPosts => {
        expect(fetchedPosts).toEqual(posts);
        expect(cacheService.set).toHaveBeenCalledWith(cacheKey, posts);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}posts?_page=1&_limit=10`);
      expect(req.request.method).toBe('GET');
      req.flush(posts);
    });

  });

  describe('getPost', () => {
    it('should fetch a single post from the API', () => {
      const postId = 1;
      const post: Post = { id: postId, userId: 1, title: 'Post 1', body: 'Body of post 1' };

      service.getPost(postId).subscribe(fetchedPost => {
        expect(fetchedPost).toEqual(post);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}posts/${postId}`);
      expect(req.request.method).toBe('GET');
      req.flush(post);
    });
  });

  describe('createPost', () => {
    it('should add a new post and update the cache', () => {
      const newPost: Post = { id: 3, userId: 1, title: 'New Post', body: 'Body of new post' };
      const cacheKey = 'posts-page-1-limit-10';
      const cachedPosts: Post[] = [
        { id: 1, userId: 1, title: 'Post 1', body: 'Body of post 1' },
        { id: 2, userId: 1, title: 'Post 2', body: 'Body of post 2' }
      ];

      jest.spyOn(cacheService, 'get').mockReturnValue(cachedPosts);
      jest.spyOn(cacheService, 'set');

      service.createPost(newPost).subscribe(post => {
        expect(post).toEqual(newPost);
        expect(cacheService.set).toHaveBeenCalledWith(cacheKey, [...cachedPosts, newPost]);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}posts`);
      expect(req.request.method).toBe('POST');
      req.flush(newPost);
    });

  });

  describe('updatePost', () => {
    it('should update an existing post and update the cache', () => {
      const postId = 1;
      const updatedPost: Post = { id: postId, userId: 1, title: 'Updated Post', body: 'Updated body' };
      const cacheKey = 'posts-page-1-limit-10';
      const cachedPosts: Post[] = [
        { id: 1, userId: 1, title: 'Post 1', body: 'Body of post 1' },
        { id: 2, userId: 1, title: 'Post 2', body: 'Body of post 2' }
      ];

      jest.spyOn(cacheService, 'get').mockReturnValue(cachedPosts);
      jest.spyOn(cacheService, 'set');

      service.updatePost(postId, updatedPost).subscribe(post => {
        expect(post).toEqual(updatedPost);
        expect(cacheService.set).toHaveBeenCalledWith(cacheKey, [
          ...cachedPosts.map(p => (p.id === postId ? updatedPost : p))
        ]);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}posts/${postId}`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedPost);
    });

  });

  describe('deletePost', () => {
    it('should delete a post and update the cache', () => {
      const postId = 1;
      const cacheKey = 'posts-page-1-limit-10';
      const cachedPosts: Post[] = [
        { id: 1, userId: 1, title: 'Post 1', body: 'Body of post 1' },
        { id: 2, userId: 1, title: 'Post 2', body: 'Body of post 2' }
      ];

      jest.spyOn(cacheService, 'get').mockReturnValue(cachedPosts);
      jest.spyOn(cacheService, 'set');

      service.deletePost(postId).subscribe(() => {
        expect(cacheService.set).toHaveBeenCalledWith(cacheKey, [
          ...cachedPosts.filter(p => p.id !== postId)
        ]);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}posts/${postId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

  });

  describe('getCommentsForPost', () => {
    it('should fetch comments for a post', () => {
      const postId = 1;
      const comments = [
        { id: 1, postId, body: 'Comment 1' },
        { id: 2, postId, body: 'Comment 2' }
      ];

      service.getCommentsForPost(postId).subscribe(fetchedComments => {
        expect(fetchedComments).toEqual(comments);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}posts/${postId}/comments`);
      expect(req.request.method).toBe('GET');
      req.flush(comments);
    });

  });
});
