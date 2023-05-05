import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appSubraya]'
})
export class SubrayaDirective {

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.resaltar('blue', 'pointer', 'underline');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.resaltar('#999999', 'auto', 'none');
  }

  private resaltar(color: string, cursor: string, decor: string) {
    this.el.nativeElement.style.backgroundColor = color;
    this.el.nativeElement.style.cursor = cursor;
    this.el.nativeElement.style.textDecoration = decor;
  }

}