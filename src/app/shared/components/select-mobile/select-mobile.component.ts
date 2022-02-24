import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-mobile',
  templateUrl: './select-mobile.component.html',
  styleUrls: ['./select-mobile.component.scss']
})
export class SelectMobileComponent implements OnInit {
  @Input() listItem;
  @Input() addItemTitle='Add';
  @Input() addItemRoute='';

  @Output() selectedListItem=new EventEmitter();
  @Output() addItemHandler=new EventEmitter();
  constructor(private _route:Router) { }
  intersections;
  ngOnInit(): void {
   
  }
  getShortName(obj) { 
    const name =obj[Object.keys(obj)[0]];
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    } else {
      return "AA"
    }
   
  }
  onAddItem(){
    this.addItemHandler.emit()
    // if (this._route.url=='/will/createWill') {
    //   this._route.navigate([`${this.addItemRoute}`], { queryParams:{y:'will'}});
    //   return;
    // }
    // if (this._route.url=='/liabilities/securedLoan') {
    //   this._route.navigate([`${this.addItemRoute}`], { queryParams:{y:'secure'}});
    //   return;
    // }
    // if (this._route.url=='/liabilities/privateDebt') {
    //   this._route.navigate([`${this.addItemRoute}`], { queryParams:{y:'private'}});
    //   return;
    // }
    // this._route.navigate([this.addItemRoute]);
  }
  delete(index: any) {
    this.listItem.splice(index,1);
    this.selectedListItem.emit(this.listItem);
  }
}
