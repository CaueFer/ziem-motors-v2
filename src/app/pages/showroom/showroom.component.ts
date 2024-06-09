import { ViewportScroller } from '@angular/common';
import { Component, OnInit, Renderer2, afterNextRender } from '@angular/core';
@Component({
  selector: 'app-showroom',
  templateUrl: './showroom.component.html',
  styleUrl: './showroom.component.scss',
})
export class ShowroomComponent implements OnInit {
  scrollDown: boolean = false;

  constructor(
    private viewportScroller: ViewportScroller,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.viewportScroller.scrollToPosition([0, 0]);

    setTimeout(() => {
      const selects = document.querySelectorAll('.form-select');

      if (selects) {
        selects.forEach((select) => {
          select.addEventListener('change', (event) => {
            const selectElement = event.target as HTMLSelectElement;
            const parentElement =
              selectElement.previousElementSibling as HTMLElement;

            if (selectElement.value !== '0') {
              this.renderer.addClass(parentElement, 'active');
            } else {
              this.renderer.removeClass(parentElement, 'active');
            }
          });
        });
      }
    }, 0); 
  }

  showLoader(evetEmit: boolean) {
    //console.log(evetEmit);

    const loader = document.getElementById('loadingDiv');
    if (loader) loader.classList.add('notShow');

    setTimeout(() => {
      const divElement = document.getElementById('carOptionsId');
      if (divElement) divElement.classList.add('active');
    }, 1500);
  }

  getNumberArray(length: number): number[] {
    return Array.from({ length }, (_, index) => index);
  }

  windowScroll() {
    const navbar = document.getElementById('carOptionsId');

    if (navbar) {
      if (
        document.body.scrollTop >= 100 ||
        document.documentElement.scrollTop >= 100
      ) {
        navbar.classList.remove('active');
        this.scrollDown = true;
      } else {
        navbar.classList.add('active');

        this.scrollDown = false;
      }
    }
  }

  verificarSelecao() {
    const selectElement: HTMLSelectElement | null = document.getElementById(
      'selectKm'
    ) as HTMLSelectElement;
    const valorSelecionado: string = selectElement.value;

    if (valorSelecionado === '') {
      console.log('Nenhum valor selecionado.');
    } else {
      console.log('Valor selecionado: ' + valorSelecionado);
    }
  }
}
