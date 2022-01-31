import { Component, Input, OnInit, Output ,EventEmitter} from '@angular/core';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
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
