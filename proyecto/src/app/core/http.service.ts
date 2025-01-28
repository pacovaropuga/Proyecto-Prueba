import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from '../../enviroments/enviroment';
import { Token } from './token.model';


@Injectable({ providedIn: 'root' })
export class HttpService {
  static API_END_POINT = environment.API;
  static UNAUTHORIZED = 401;

  private token: Token | undefined;
  private headers: HttpHeaders = new HttpHeaders();
  private params: HttpParams = new HttpParams();

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  login(username: string, password: string, endPoint: string): Observable<any> {
    return this.authBasic(username, password)
      .post(endPoint)
      .pipe(
        map((token: Token) => {
          const jwtHelper = new JwtHelperService();
          this.token = token;
          this.token.username = jwtHelper.decodeToken(token.token).user;
          this.token.roles = jwtHelper.decodeToken(token.token).roles;
        }),
        catchError((error) => this.handleError(error))
      );
  }

  logout(): void {
    this.token = undefined;
    this.router.navigate(['']);
  }

  getToken(): Token | undefined {
    return this.token;
  }

  post(endpoint: string, body?: Object): Observable<any> {
    return this.http
      .post<any>(HttpService.API_END_POINT + endpoint, body, this.createOptions())
      .pipe(
        map((response) => response),
        catchError((error) => this.handleError(error))
      );
  }

  private authBasic(username: string, password: string): HttpService {
    this.headers = this.headers.set(
      'Authorization',
      'Basic ' + btoa(username + ':' + password)
    );
    return this;
  }

  private createOptions(): any {
    if (this.token) {
      this.headers = this.headers.set('Authorization', 'Bearer ' + this.token.token);
    }
    return { headers: this.headers, params: this.params };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMsg = error.error?.message || 'Unknown error occurred';
    this.snackBar.open(`Error: ${errorMsg}`, 'Close', {
      duration: 5000,
    });
    if (error.status === HttpService.UNAUTHORIZED) {
      this.logout();
    }
    return throwError(() => new Error(errorMsg));
  }
}
