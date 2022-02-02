import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit {
@Input() hideModal:boolean;
@Output() closeModal = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  onClickBackButton(){
    this.closeModal.emit();
  }

}
