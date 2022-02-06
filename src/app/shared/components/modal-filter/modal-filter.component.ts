import { Component, Input, OnInit, Output ,EventEmitter} from '@angular/core';


@Component({
  selector: 'app-modal-filter',
  templateUrl: './modal-filter.component.html',
  styleUrls: ['./modal-filter.component.scss']
})
export class ModalFilterComponent implements OnInit {
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
