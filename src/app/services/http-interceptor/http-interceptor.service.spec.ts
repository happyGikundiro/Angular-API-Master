import { TestBed } from '@angular/core/testing';
import { HttpInterceptorService } from './http-interceptor.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpRequest, HttpHandler } from '@angular/common/http';
import { throwError } from 'rxjs';

describe('HttpInterceptorService', () => {
  let service: HttpInterceptorService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpInterceptorService]
    });

    service = TestBed.inject(HttpInterceptorService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should log HTTP request and error', () => {
    const spyConsoleLog = jest.spyOn(console, 'log').mockImplementation();

    const mockHandler = {
      handle: (req: HttpRequest<any>) => throwError(() => new Error('Test Error'))
    } as unknown as HttpHandler;

    service.intercept(
      new HttpRequest<any>('GET', '/posts'),
      mockHandler
    ).subscribe({
      error: (error) => {
        expect(spyConsoleLog).toHaveBeenCalledWith('HTTP Error:', expect.any(Error));
      }
    });

    spyConsoleLog.mockRestore();
  });
});
