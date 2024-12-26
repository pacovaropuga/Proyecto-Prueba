import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from '../../enviroments/enviroment';
import { Token } from './token.model';
import { Error } from './error.model';

@Injectable({ providedIn: 'root' })
/**
 * This service handles HTTP requests and responses.
 * It provides methods for login, logout, and various HTTP operations (GET, POST, PUT, PATCH, DELETE).
 * It also manages authentication tokens and handles errors.
 */
export class HttpService {
  static API_END_POINT = environment.API;
  static UNAUTHORIZED = 401;
  static NOT_FOUND = 404;

  private token: Token | undefined;
  private headers: HttpHeaders = new HttpHeaders(); // Ensure initialization
  private params: HttpParams = new HttpParams(); // Ensure initialization
  private responseType: 'json' | 'blob' = 'json'; // Ensure initialization
  private successfulNotification: string | undefined = undefined;
  private printDirectly: boolean = false;

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private router: Router) {
    this.resetOptions();
  }

  login(username: string, password: string, endPoint: string): Observable<any> {
    return this.authBasic(username, password).post(endPoint).pipe(
      map((token: Token) => {
        const jwtHelper = new JwtHelperService();
        this.token = token;
        this.token.username = jwtHelper.decodeToken(token.token).user;
        this.token.password = jwtHelper.decodeToken(token.token).name;
        this.token.roles = jwtHelper.decodeToken(token.token).roles;
      }),
      catchError(error => this.handleError(error))
    );
  }

  logout(): void {
    this.token = undefined;
    this.router.navigate(['']);
  }

  getToken(): Token | undefined {
    return this.token;
  }

  param(key: string, value: string): HttpService {
    this.params = this.params.append(key, value); // HttpParams is immutable
    return this;
  }

  successful(notification = 'Successful'): HttpService {
    this.successfulNotification = notification;
    return this;
  }

  pdf(printDirectly = true): HttpService {
    this.printDirectly = printDirectly;
    this.responseType = 'blob';
    this.header('Accept', 'application/pdf , application/json');
    return this;
  }

  post(endpoint: string, body?: Object): Observable<any> {
    return this.http.post<any>(HttpService.API_END_POINT + endpoint, body, this.createOptions()).pipe(
      map(response => this.extractData(response)),
      catchError(error => this.handleError(error))
    );
  }

  get(endpoint: string): Observable<any> {
    return this.http.get<any>(HttpService.API_END_POINT + endpoint, this.createOptions()).pipe(
      map(response => this.extractData(response)),
      catchError(error => this.handleError(error))
    );
  }

  put(endpoint: string, body?: Object): Observable<any> {
    return this.http.put<any>(HttpService.API_END_POINT + endpoint, body, this.createOptions()).pipe(
      map(response => this.extractData(response)),
      catchError(error => this.handleError(error))
    );
  }

  patch(endpoint: string, body?: Object): Observable<any> {
    return this.http.patch<any>(HttpService.API_END_POINT + endpoint, body, this.createOptions()).pipe(
      map(response => this.extractData(response)),
      catchError(error => this.handleError(error))
    );
  }

  delete(endpoint: string): Observable<any> {
    return this.http.delete<any>(HttpService.API_END_POINT + endpoint, this.createOptions()).pipe(
      map(response => this.extractData(response)),
      catchError(error => this.handleError(error))
    );
  }

  private header(key: string, value: string): HttpService {
    this.headers = this.headers.append(key, value); // HttpHeaders is immutable
    return this;
  }

  private authBasic(username: string, password: string): HttpService {
    return this.header('Authorization', 'Basic ' + btoa(username + ':' + password));
  }

  private resetOptions(): void {
    this.headers = new HttpHeaders();
    this.params = new HttpParams();
    this.responseType = 'json';
  }

  private createOptions(): any {
    if (this.token) {
      this.header('Authorization', 'Bearer ' + this.token.token);
    }
    const options: any = {
      headers: this.headers,
      params: this.params,
      responseType: this.responseType,
      observe: 'response' as const
    };
    this.resetOptions();
    return options;
  }

  private extractData(response: any): any {
    if (this.successfulNotification) {
      this.snackBar.open(this.successfulNotification, '', {
        duration: 2000
      });
      this.successfulNotification = undefined;
    }
    const contentType: string | null = response.headers.get('content-type');
    if (contentType) {
      if (contentType.includes('application/pdf')) {
        const blob: Blob = new Blob([response.body], { type: 'application/pdf' });
        if (this.printDirectly) {
          const iFrame: HTMLIFrameElement = document.createElement('iframe');
          iFrame.src = URL.createObjectURL(blob);
          iFrame.style.visibility = 'hidden';
          document.body.appendChild(iFrame);
          iFrame.contentWindow?.focus();
          iFrame.contentWindow?.print();
        } else {
          window.open(window.URL.createObjectURL(blob));
        }
      } else if (contentType.includes('application/json')) {
        return response.body;
      }
    } else {
      return response;
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === HttpService.UNAUTHORIZED) {
      this.snackBar.open('Unauthorized', 'Error', {
        duration: 2000
      });
      this.logout();
      this.router.navigate(['']);
      return throwError(() => error.error);
    } else {
      const errorMsg = error.error?.error || 'No server response';
      const errorMessage = error.error?.message || '';
      this.snackBar.open(`${errorMsg}: ${errorMessage}`, 'Error', {
        duration: 5000
      });
      return throwError(() => error.error || error);
    }
  }
}
