import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSubraya]'
})
export class SubrayaDirective {

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    console.log('paso por aca');
    this.resaltar('blue', 'pointer', 'underline');
  }

  @HostListener('mouseleave') onMouseLeave() {
    console.log('salgo de aca');
    this.resaltar('#999999', 'auto', 'none');
  }

  private resaltar(decor: string, color: string, cursor: string) {
    this.el.nativeElement.style.backgroundcolor = color;
    this.el.nativeElement.style.cursor = cursor;
    this.el.nativeElement.style.textDecoration = decor;
  }

}