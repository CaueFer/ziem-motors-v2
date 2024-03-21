
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nav-default',
  templateUrl: './nav-default.component.html',
  styleUrl: './nav-default.component.scss'
})
export class NavDefaultComponent {
  currentSection:any = 'home';
  isSticky: boolean = false;

  @Input  () variant: string = '';


  constructor() { }

  ngOnInit() {

    // JSONS ===================== 

    // this.http.get<any>('../../../assets/json/planos.json').subscribe(data => {
    //   this.planos = data;
    // });
  }

  ngOnDestroy(): void {
  }
  /**
   * Window scroll method
   */
  windowScroll() {
    const navbar = document.getElementById('navbar');

    if(navbar){
      if (document.body.scrollTop >= 50 || document.documentElement.scrollTop >= 50) {
        navbar.classList.add('nav-sticky')
        this.isSticky = true;
      } else {
        navbar.classList.remove('nav-sticky')
        this.isSticky = false;
      }
    }
  }

  /**
   * Toggle navbar
   */
  toggleMenu() {
    const navContent = document.getElementById('topnav-menu-content');
    
    if(navContent) navContent.classList.toggle('show');
  }

  /**
   * Section changed method
   * @param sectionId specify the current sectionID
   */
  
  onSectionChange(sectionId: string) {
    this.currentSection = sectionId;
  }
}
