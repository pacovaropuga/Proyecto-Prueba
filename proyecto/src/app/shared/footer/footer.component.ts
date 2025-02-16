import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css'],
    standalone: false
})
export class FooterComponent implements OnInit {

  currentYear: number;

  constructor() { 
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    console.log('FooterComponent initialized');
  }
}
