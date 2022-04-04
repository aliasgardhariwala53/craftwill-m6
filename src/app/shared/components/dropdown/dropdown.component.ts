import { Component, OnInit,Input ,Output,EventEmitter, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  exportAs: 'dropdown'
})
export class DropdownComponent implements OnInit,OnChanges {

  constructor() { }
  @Input() selectedOption = 'Select Option';
  @Input() primary = false;
  @Input() changeSelected = true;
  @Input() list = [];
  @Input() positon = 'relative';
  @Input() margin = 'mt-2';
  @Input() width = "min-w-[200px]";
  @Output() handleSelect = new EventEmitter();

  @Input() open = false;
  ngOnInit(): void {
  }
ngOnChanges(changes: SimpleChanges): void {
  //console.log(this.positon);
  
}
  selectOption(option): void {
    if (this.changeSelected) { this.selectedOption = option; }
    this.handleSelect.emit(option);
  }

  trackByFn(index): number {
    return index;
  }
}
