import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { UntypedFormControl } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-searchpanel',
  standalone: true,
  imports: [],
  templateUrl: './searchpanel.component.html',
  styleUrl: './searchpanel.component.css'
})
export class SearchpanelComponent implements OnInit {

  autocompleteTermino = new UntypedFormControl()
  words$: any
  constructor(private searchService: SearchService, private iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,
              private route:ActivatedRoute) {
    iconRegistry.addSvgIconLiteral('search', sanitizer.bypassSecurityTrustHtml(this.icon),

        )
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      let word = params.get('word')

      this.searchService.filter(word)
          .subscribe((res: any) =>{
            console.log(res);
            let selected = res.find(r => r.term == word)
            this.seleccionarTermino(selected)
          })
    })

    this.autocompleteTermino.valueChanges
        .pipe(
            debounceTime(500),
            filter(word => word.length > 0)
        )
        .subscribe(word => this.words$ = this.searchService.filter(word))
  }

  seleccionarTermino(option : any) {
    console.log(option);
    this.searchService.entryLanguage = option.language
    this.searchService.getEntries(option.idTerm, option.term)
        .subscribe(r => this.searchService.entries$.next((r)))

  }

  displayFn(term: any): string {
    return term?.term || '';
  }

  icon = `<?xml version="1.0" encoding="UTF-8" standalone="no"?> <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><defs><style>.cls-1{fill:#ffffff;}</style></defs><title>x</title><path class="cls-1" d="M120.5891,106.37506,96.5609,80.39355l-3.842,3.8457-4.35187-4.35187c.33368-.43195.667-.864.98346-1.30475A46.77661,46.77661,0,1,0,77.87956,89.85687q.99472-.68619,1.955-1.42987l4.34509,4.345-4.31427,4.31409,26.5097,23.5246a10.0585,10.0585,0,1,0,14.21405-14.23566ZM74.21977,74.22931a32.4793,32.4793,0,1,1,9.48859-22.94189A32.48241,32.48241,0,0,1,74.21977,74.22931Z"/></svg>`

}
