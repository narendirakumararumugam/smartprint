import { Directive, HostListener } from "@angular/core";

@Directive({
  selector: '[appPreventDefault]',
  standalone: true
})
export class PreventDefaultDirective {
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    console.log('clicked')
    event.preventDefault();
  }
}
