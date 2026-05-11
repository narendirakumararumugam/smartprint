import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [NgbDropdown,
      NgbDropdownToggle,
      NgbDropdownMenu,
      NgbDropdownButtonItem,
      NgbDropdownItem,
      ],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css'
})
export class DropdownComponent {
  @Input() options: any[] = [];
  @Input() selectedValue: any;
  @Input() label: string = '';
  @Input() labelIcon: string = '';
  @Output() valueChange = new EventEmitter<any>();

  updateValue(value: any){
    this.valueChange.emit(value);
  }
}
