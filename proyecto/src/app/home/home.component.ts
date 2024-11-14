import { Component, OnInit } from '@angular/core';
import { SearchpanelComponent } from "./searchpanel/searchpanel.component";
import { TranslationpanelComponent } from "./translationpanel/translationpanel.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchpanelComponent, TranslationpanelComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  

  constructor() { }

  ngOnInit(): void {
  }

}
