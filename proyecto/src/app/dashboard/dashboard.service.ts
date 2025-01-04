import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';
import { Entry } from '../core/models/entry.model';
import { Translation } from '../core/models/trasnslation.model';
import { Variant } from '../core/models/variant.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private _term$ = new BehaviorSubject<Entry | null>(null);
  private _newEntry$ = new BehaviorSubject<string | null>(null);

  public translations$ = new BehaviorSubject<Translation[]>([]);
  public parents$ = new BehaviorSubject<any[]>([]);

  public language: string = '';
  public dashboardData: any = {};

  public selectedTerm$ = new BehaviorSubject<any | null>(null);
  public children$ = new Subject<any>();
  public addTo$ = new Subject<any>();
  public addToParents$ = new Subject<any>();
  public addToVariants$ = new Subject<Variant>();
  public save$ = new Subject<void>();
  public newTerm$ = new Subject<void>();
  public displayTermCrud$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  get term$() {
    return this._term$.asObservable();
  }

  get newEntry$() {
    return this._newEntry$.asObservable();
  }

  save() {
    return this.http.post(environment.API + '/api/entries', this.dashboardData);
  }

  deleteEntry(id: number) {
    return this.http.delete(environment.API + '/api/entry/' + id);
  }

  getTranslations(idEntry: number) {
    return this.http.get(environment.API + '/api/examples/?idEntry=' + idEntry);
  }

  addTranslation(data: any) {
    return this.http.post(environment.API + '/api/translations', data);
  }
}
