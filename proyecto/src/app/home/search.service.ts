import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../enviroments/enviroment';
import {Subject} from 'rxjs';
import {map, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SearchService {

    entryLanguage: string;

    constructor(private http: HttpClient) {
    }

    filter(word: string, language?: string) {
        return this.http.get(environment.API + '/api/terms/' + word, {
            params: {
                language
            }
        });
    }

    getEntries(idTerm: number, term: string) {
        return this.http.get(environment.API + '/api/entry', {
            params: {
                idTerm: idTerm.toString()
            }
        });

    }

    findVariantsByIdEntry(idEntry: number) {
        return this.http.get(environment.API + '/api/variant/' + idEntry);
    }

    getVariants(idTerm: number) {
        return this.http.get(environment.API + '/api/entries/children', {
            params: {
                idTerm: idTerm.toString()
            }
        });
    }

    getParents(idTerm: number) {
        return this.http.get(environment.API + '/api/entries/parents', {
            params: {
                idTerm: idTerm.toString()
            }
        });
    }

    entries$: Subject<any> = new Subject<any>();

}
