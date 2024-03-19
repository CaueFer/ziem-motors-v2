import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-default',
  templateUrl: './footer-default.component.html',
  styleUrl: './footer-default.component.scss'
})
export class FooterDefaultComponent {

  year: number;

  constructor(){
    this.year = new Date().getFullYear();
  }
}
