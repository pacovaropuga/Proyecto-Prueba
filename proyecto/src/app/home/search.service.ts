import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';
import { Subject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  entryLanguage: string = ''; // Inicialización explícita

  entries$: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient) {}

  filter(word: string, language?: string): Observable<any> {
    const params = language ? new HttpParams().set('language', language) : undefined;

    return this.http.get(`${environment.API}/api/terms/${word}`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getEntries(idTerm: number): Observable<any> {
    return this.http.get(`${environment.API}/api/entry`, {
      params: new HttpParams().set('idTerm', idTerm.toString())
    }).pipe(
      catchError(this.handleError)
    );
  }

  findVariantsByIdEntry(idEntry: number): Observable<any> {
    return this.http.get(`${environment.API}/api/variant/${idEntry}`).pipe(
      catchError(this.handleError)
    );
  }

  getVariants(idTerm: number): Observable<any> {
    return this.http.get(`${environment.API}/api/entries/children`, {
      params: new HttpParams().set('idTerm', idTerm.toString())
    }).pipe(
      catchError(this.handleError)
    );
  }

  getParents(idTerm: number): Observable<any> {
    return this.http.get(`${environment.API}/api/entries/parents`, {
      params: new HttpParams().set('idTerm', idTerm.toString())
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('SearchService Error:', error);
    throw error; // Propaga el error para ser manejado externamente
  }
}
