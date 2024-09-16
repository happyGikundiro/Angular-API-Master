import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, retry, tap,  } from 'rxjs/operators';
import { CacheService } from '../cache/cache.service';
import { Post } from '../../model/model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private apiUrl = environment.apiUrl + 'posts';

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  // getPosts(page: number, limit: number): Observable<Post[]> {
  //   const cacheKey = `posts-page-${page}-limit-${limit}`;
  //   const cachedData = this.cacheService.get(cacheKey);

  //   if (cachedData) {
  //     return cachedData;
  //   }

  //   return this.http.get<Post[]>(`${this.apiUrl}?_page=${page}&_limit=${limit}`).pipe(
  //     retry(3),
  //     catchError(this.handleError)
  //   );
  // }
  getPosts(page: number, limit: number): Observable<Post[]> {
    const cacheKey = `posts-page-${page}-limit-${limit}`;
    const cachedData = this.cacheService.get(cacheKey);
  
    if (cachedData) {
      return of(cachedData);
    }
  
    return this.http.get<Post[]>(`${this.apiUrl}?_page=${page}&_limit=${limit}`).pipe(
      tap((data) => this.cacheService.set(cacheKey, data)),
      retry(3),
      catchError(this.handleError)
    );
  }
  

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post).pipe(
      catchError(this.handleError)
    );
  }

  updatePost(id: number, post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, post).pipe(
      catchError(this.handleError)
    );
  }

  deletePost(id: number): Observable<Post> {
    return this.http.delete<Post>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getCommentsForPost(postId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${postId}/comments`).pipe(
      catchError(this.handleError)
    );
  }  

  private handleError(error: Post) {
    return throwError('Something went wrong, please try again later.');
  }
}
