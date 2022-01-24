import { UpperCasePipe } from '@angular/common';
import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.scss']
})
export class SelectBoxComponent implements OnInit {
@Input() key=[];
@Input() listItem;
@Input() classes;
@Input() addItemTitle;
@Input() avtarType='name';
@Input() routerLink='name';
@Input() imageUrl='../../../../assets/Icons/DP.svg';
@Output() onSelectId=new EventEmitter;
@Output() onAddNewItem=new EventEmitter;



constructor(private _route:Router) { }
onSelectItem(value){
  this.onSelectId.emit(value);

}
onAddItem(){
  this._route.navigate([this.routerLink]);
}
getShortName(fullName) { 
  if (fullName) {
    return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
  } else {
    return "AA"
  }
 
}
ngOnInit(): void {
    console.log(this.listItem);
  }

}
