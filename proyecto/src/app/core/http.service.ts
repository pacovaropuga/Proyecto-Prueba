import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {SnackBar} from 'bootstrap';

import {JwtHelperService} from '@auth0/angular-jwt';

import {environment} from '../environments/environment';
import {Token} from './token.model';
import {Error} from './error.model';

@Injectable()
/**
 * This service handles HTTP requests and responses.
 * It provides methods for login, logout, and various HTTP operations (GET, POST, PUT, PATCH, DELETE).
 * It also manages authentication tokens and handles errors.
 */
export class HttpService {
  static API_END_POINT = environment.API;
  static UNAUTHORIZED = 401;
  static NOT_FOUND = 404;

  private token: Token;
  private headers: HttpHeaders;
  private params: HttpParams;
  private responseType: string;
  private successfulNotification = undefined;
  private printDirectly: boolean;

//Este es el constructor de la clase HttpService
//Recibe como parametros un objeto de tipo HttpClient, un objeto de tipo SnackBar y un objeto de tipo Router
//Este constructor se encarga de inicializar las variables de la clase
//
  constructor(private http: HttpClient, private snackBar: SnackBar, private router: Router) {
     this.resetOptions();
  }


//Este metodo es el que se encarga de hacer el login
//Recibe como parametros el username, password y el endPoint
//Retorna un observable de cualquier tipo
//Este metodo se encarga de hacer el login, y si el login es exitoso, se guarda el token en el local storage
//Si el login no es exitoso, se muestra un mensaje de error

  login(username: string, password: string, endPoint: string): Observable<any> {
    return this.authBasic(username, password).post(endPoint).pipe(
      map(token => {
        this.token = token;
        this.token.username = new JwtHelperService().decodeToken(token.token).user;
        this.token.password = new JwtHelperService().decodeToken(token.token).name;
        this.token.roles = new JwtHelperService().decodeToken(token.token).roles;
      }), catchError(error => {
        return this.handleError(error);
      })
    );
  }

  //Este metodo se encarga de hacer el logout
  //No recibe parametros
  //No retorna nada
  //Este metodo se encarga de borrar el token del local storage y redirigir al usuario a la pagina de login
  logout(): void {
    this.token = undefined;
    this.router.navigate(['']);
  }

//Este metodo se encarga de obtener el token
//No recibe parametros
//Retorna un objeto de tipo Token
  getToken(): Token {
    return this.token;
  }

  //Este metodo se encarga de obtener el token
  //No recibe parametros
  //Retorna un objeto de tipo Token

  param(key: string, value: string): HttpService {
    this.params = this.params.append(key, value); // This class is immutable
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
    return this.http.post(HttpService.API_END_POINT + endpoint, body, this.createOptions()).pipe(
      map(response => this.extractData(response)
      ), catchError(error => {
        return this.handleError(error);
      })
    );
  }

  get(endpoint: string): Observable<any> {
    return this.http.get(HttpService.API_END_POINT + endpoint, this.createOptions()).pipe(
      map(response => this.extractData(response)
      ), catchError(error => {
        return this.handleError(error);
      })
    );
  }

  put(endpoint: string, body?: Object): Observable<any> {
    return this.http.put(HttpService.API_END_POINT + endpoint, body, this.createOptions()).pipe(
      map(response => this.extractData(response)
      ), catchError(error => {
        return this.handleError(error);
      })
    );
  }

  patch(endpoint: string, body?: Object): Observable<any> {
    return this.http.patch(HttpService.API_END_POINT + endpoint, body, this.createOptions()).pipe(
      map(response => this.extractData(response)
      ), catchError(error => {
        return this.handleError(error);
      })
    );
  }

  delete(endpoint: string): Observable<any> {
    return this.http.delete(HttpService.API_END_POINT + endpoint, this.createOptions()).pipe(
      map(response => this.extractData(response)
      ), catchError(error => {
        return this.handleError(error);
      })
    );
  }

  private header(key: string, value: string): HttpService {
    this.headers = this.headers.append(key, value); // This class is immutable
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
    if (this.token !== undefined) {
      this.header('Authorization', 'Bearer ' + this.token.token);
    }
    const options: any = {
      headers: this.headers,
      params: this.params,
      responseType: this.responseType,
      observe: 'response'
    };
    this.resetOptions();
    return options;
  }

  private extractData(response): any {
    if (this.successfulNotification) {
      this.snackBar.open(this.successfulNotification, '', {
        duration: 2000
      });
      this.successfulNotification = undefined;
    }
    const contentType = response.headers.get('content-type');
    if (contentType) {
      if (contentType.indexOf('application/pdf') !== -1) {
        const blob = new Blob([response.body], {type: 'application/pdf'});
        if (this.printDirectly) {
          const iFrame = document.createElement('iframe');
          iFrame.src = URL.createObjectURL(blob);
          iFrame.style.visibility = 'hidden';
          document.body.appendChild(iFrame);
          iFrame.contentWindow.focus();
          iFrame.contentWindow.print();
        } else {
          window.open(window.URL.createObjectURL(blob));
        }
      } else if (contentType.indexOf('application/json') !== -1) {
        return response.body; // with 'text': JSON.parse(response.body);
      }
    } else {
      return response;
    }
  }

  private handleError(response): any {
    let error: Error;
    if (response.status === HttpService.UNAUTHORIZED) {
      this.snackBar.open('Unauthorized', 'Error', {
        duration: 2000
      });
      this.logout();
      this.router.navigate(['']);
      return throwError(response.error);
    } else {
      try {
        if (response.status === HttpService.NOT_FOUND) {
          error = {error: 'Not Found', message: '', path: ''};
        } else {
          error = response.error; // with 'text': JSON.parse(response.error);
        }
        this.snackBar.open(error.error + ': ' + error.message, 'Error', {
          duration: 5000
        });
        return throwError(error);
      } catch (e) {
        this.snackBar.open('No server response', 'Error', {
          duration: 5000
        });
        return throwError(response.error);
      }
    }
  }
}
