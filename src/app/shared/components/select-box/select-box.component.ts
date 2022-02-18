import { UpperCasePipe } from '@angular/common';
import { Component, Input, OnInit, Output,EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';


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
@Input() shareToggle:boolean=false;
@Input() deleteToggle:boolean=false;
@Input() imageUrl='../../../../assets/Icons/DP.svg';
@Output() onSelectId=new EventEmitter;
@Output() onAddNewItem=new EventEmitter;
@Output() onDeleteHandler=new EventEmitter;
@Input() selectedItems:Array<any>=[];
@Output() shareDataHandler = new EventEmitter();
@Output() actionButton = new EventEmitter();
selectedItem: Array<any>=[];
currentRoute:string;
arr4=[];
shareValue=0;
constructor(private _route:Router,private currentUrl:ActivatedRoute) { 
  console.log(this.selectedItem);
}

sharePercentage(e, itemId){
  if (parseInt(e.target.value)>100) {
    this.shareValue=100;
  } else if(parseInt(e.target.value)<0){
    this.shareValue=0;
  }else{
    this.shareValue =parseInt(e.target.value);
  }
  const myItem = this.arr4.findIndex((el) => el.id === itemId);
  if(myItem === -1) {
    this.arr4.push({
      id: itemId,
      share: this.shareValue
    })
  }
  else {
    const newarr= this.arr4.map((el)=>{
      if (el.id === itemId) {
        return {id:itemId,share:this.shareValue};
      }
      return el;
      });
  
    this.arr4 = [...newarr];
  }
  this.shareDataHandler.emit({shareData:this.arr4,id:itemId});
console.log(this.arr4);

}
clicl(value){
  console.log(value);
  
}
onClickActionButton(Item){
  
  this.actionButton.emit(Item._id);
  if (this._route.url=='/will/createWill') {
    this._route.navigate([`${Item.actionRoute}`], { queryParams:{id:Item._id,y:'will'}});
    return;
  }
  this._route.navigate([`${Item.actionRoute}`], { queryParams:{id:Item._id}})
  
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
deleteHandler(){

}
onAddItem(){
  if (this._route.url=='/will/createWill') {
    this._route.navigate([`${this.addItemRoute}`], { queryParams:{y:'will'}});
    return;
  }
  if (this._route.url=='/liabilities/securedLoan') {
    this._route.navigate([`${this.addItemRoute}`], { queryParams:{y:'secure'}});
    return;
  }
  if (this._route.url=='/liabilities/privateDebt') {
    this._route.navigate([`${this.addItemRoute}`], { queryParams:{y:'private'}});
    return;
  }
  this._route.navigate([this.addItemRoute]);
}

getShortName(obj) { 
  const name =obj[Object.keys(obj)[0]];
  if (name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  } else {
    return "AA"
  }
 
}
ngOnChanges(changes: SimpleChanges): void {
  console.log(changes);

    
    this.selectedItem = changes['selectedItems']?.currentValue

  
}
ngOnInit(): void {
  console.log(this._route.url);
  
  if (this._route.url==='/will/createWill') {
    this.currentRoute=this._route.url
  }
  // this.selectedItem=this.selectedItems;
    console.log(this.selectedItem);
  }

}
