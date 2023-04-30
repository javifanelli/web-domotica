import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSubraya]'
})
export class SubrayaDirective {

  @HostListener('mouseenter') onMouseEnter() {
    this.resaltar('blue', 'pointer', 'underline');
    console.log('paso por aca');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.resaltar('#999999', 'auto', 'none');
    console.log('salgo de aca');
  }

  private resaltar(decor: string, color: string, cursor: string) {
    this.el.nativeElement.style.backgroundcolor = color;
    this.el.nativeElement.style.cursor = cursor;
    this.el.nativeElement.style.textDecoration = decor;
  }

  constructor(private el: ElementRef) {}
}