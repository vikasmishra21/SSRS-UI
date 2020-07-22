import { Directive, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[appEleFocus]'
})
export class EleFocusDirective {

  constructor(private el: ElementRef, private renderer: Renderer) { }

  ngAfterViewInit() {
   this.el.nativeElement.focus();
  }
}
