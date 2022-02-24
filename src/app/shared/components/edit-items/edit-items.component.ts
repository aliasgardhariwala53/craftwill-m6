import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-items',
  templateUrl: './edit-items.component.html',
  styleUrls: ['./edit-items.component.scss']
})
export class EditItemsComponent implements OnInit {
  @Input() modalHeader;
  @Input() modalBody;
  @Input() showModal;
  @Output() openModal= new EventEmitter();
  constructor() { }
  toggleModal(){
    this.showModal = true;
  }
  ngOnInit(): void {
  }
}
