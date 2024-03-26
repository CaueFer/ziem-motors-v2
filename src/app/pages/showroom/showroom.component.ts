import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
@Component({
  selector: 'app-showroom',
  templateUrl: './showroom.component.html',
  styleUrl: './showroom.component.scss'
})
export class ShowroomComponent {
  scrollDown: boolean = false;


  showLoader(evetEmit: boolean){
    //console.log(evetEmit);

    const loader = document.getElementById('loadingDiv');
    if(loader) loader.classList.add('notShow');

    setTimeout(() =>{
      const divElement = document.getElementById('carOptionsId');
      if (divElement) divElement.classList.add('active');
    }, 1500)
  }

  constructor(private viewportScroller: ViewportScroller){
  }

  ngOnInit(){
    this.viewportScroller.scrollToPosition([0, 0]);

    const selects = document.querySelectorAll('.form-select');

    if(selects){
      selects.forEach(select =>{
        select.addEventListener("change", (event) =>{
          const selectElement = event.target as HTMLSelectElement;
          const parentElement = selectElement.previousElementSibling as HTMLElement;

          if(selectElement.value !== '0'){
            parentElement.classList.add('active');
          } else parentElement.classList.remove('active');
     
        });
      })
    }

  }

  windowScroll() {
    const navbar = document.getElementById('carOptionsId');

    if(navbar){
      if (document.body.scrollTop >= 100 || document.documentElement.scrollTop >= 100) {
        navbar.classList.remove('active');
        this.scrollDown = true;
      } else {
        navbar.classList.add('active');

        this.scrollDown = false;
      }
    }
  }

  verificarSelecao() {
      const selectElement: HTMLSelectElement | null = document.getElementById("selectKm") as HTMLSelectElement;
      const valorSelecionado: string = selectElement.value;

      if (valorSelecionado === "") {
          console.log("Nenhum valor selecionado.");
      } else {
          console.log("Valor selecionado: " + valorSelecionado);
      }
  }

}
