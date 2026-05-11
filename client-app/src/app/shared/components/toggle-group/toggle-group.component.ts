import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-group',
  standalone: true,
  imports: [],
  templateUrl: './toggle-group.component.html',
  styleUrl: './toggle-group.component.css',
})
export class ToggleGroupComponent {
  @Input() label: string = '';
  @Input() options: any = {};
  @Input() optionIcon: string = '';
  @Input() labelIcon: string = '';
  @Input() selectedValue: any = '';

  @Output() valueChange = new EventEmitter<any>();

  updateValue(value: any) {
    this.valueChange.emit(value);
  }
}
