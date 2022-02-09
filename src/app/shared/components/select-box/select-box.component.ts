import { UpperCasePipe } from '@angular/common';
import { Component, Input, OnInit, Output,EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.scss']
})
export class SelectBoxComponent implements OnInit,OnChanges {
@Input() key=[];
@Input() listItem;
@Input() classes;
@Input() addItemTitle;
@Input() avtarType='name';
@Input() addItemRoute='name';
@Input() imageUrl='../../../../assets/Icons/DP.svg';
@Output() onSelectId=new EventEmitter;
@Output() onAddNewItem=new EventEmitter;
@Input() selectedItems:Array<any>=[];

selectedItem: Array<any>=[];
constructor(private _route:Router) { 
  console.log(this.selectedItem);
}
onSelectItem(value){
  this.onSelectId.emit(value);
  // if (this.selectedItem?.includes(value)) {
  //   this.selectedItem.splice(this.selectedItem.indexOf(value), 1);
 
  //   return false;
  // } else {
  //   this.selectedItem?.push(value);
  
  //   return true;
  // }
  
}
onAddItem(){
  this._route.navigate([this.addItemRoute]);
}

getShortName(fullName) { 
  if (fullName) {
    return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
  } else {
    return "AA"
  }
 
}
ngOnChanges(changes: SimpleChanges): void {
  console.log(changes);

    
    this.selectedItem = changes['selectedItems']?.currentValue
  
  
}
ngOnInit(): void {
  // this.selectedItem=this.selectedItems;
    console.log(this.selectedItem);
  }

}
