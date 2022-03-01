import { UpperCasePipe } from '@angular/common';
import { Component, Input, OnInit, Output,EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

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
@Input() addItemRoute='name';
@Input() shareToggle:boolean=false;
@Input() deleteToggle:boolean=false;
@Input() actionToggle:boolean=true;
@Input() addItemToggle:boolean=true;
@Input() dragToggle:boolean=false;
@Input() memberShareList:boolean=false;
@Input() imageUrl='../../../../assets/Icons/DP.svg';
@Output() onSelectId=new EventEmitter;
@Output() onAddNewItem=new EventEmitter;
@Output() onDeleteHandler=new EventEmitter;
@Input() selectedItems:Array<any>=[];
@Output() actionButton = new EventEmitter();
// member share list
@Input() memberListShare;

selectedItem: Array<any>=[];
currentRoute:string;
shareIdInputArray=[];
shareValue=0;
colorArray=[];
shareMemberList=[];
constructor(private _route:Router,private currentUrl:ActivatedRoute) { 
}


sharePercentage(e, itemId){
  if (parseInt(e.target.value)>100) {
    this.shareValue=100;
    return;
  } else if(parseInt(e.target.value)<0){
    this.shareValue=0;
    return;
  }else{
    this.shareValue =parseInt(e.target.value);
  }
  const myItem = this.shareIdInputArray.findIndex((el) => el._id === itemId);
  if(myItem === -1) {
    this.shareIdInputArray.push({
      _id: itemId,
      share: this.shareValue
    })
  }
  else {
     const newarr= this.shareIdInputArray.map((el)=>{
      if (el._id === itemId) {
        return {...el,share:this.shareValue};
      }
      return el;
      });
  
    this.shareIdInputArray = [...newarr];
  }
 this.onSelectId.emit(this.mergeById( this.selectedItem,this.shareIdInputArray));
 console.log(this.mergeById( this.selectedItem,this.shareIdInputArray));
 
}
 mergeById (a1, a2) { 
   return a1.map(itm => ({
        ...a2.find((item) => (item._id === itm._id) && item),
        ...itm
    }))};
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
  let selectedObj = this.listItem.filter((el) => el._id === value);
  const myItem = this.selectedItem.findIndex((el) => el._id === value);
  if (myItem !== -1) {
    this.selectedItem =this.selectedItem.filter((el) => el._id !== value);
    this.onSelectId.emit(this.mergeById( this.selectedItem,this.shareIdInputArray));
    
  } else { 
  this.selectedItem.push(...selectedObj);
  this.onSelectId.emit(this.mergeById( this.selectedItem,this.shareIdInputArray));
  }
  this.colorArray=this.selectedItem.map((el)=>el._id)
  console.log(this.mergeById( this.selectedItem,this.shareIdInputArray));
  this.checkId(value);
  
}
checkId(id){
  console.log(this.selectedItem?.includes((el)=>el._id===id), id);
  
  return this.selectedItem?.includes((el)=>el._id===id)
}
delete(index: any) {
  this.listItem.splice(index,1);
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
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substr(0,2);;
  } else {
    return "AA"
  }
 
}
drop(event: CdkDragDrop<string[]>) {
  moveItemInArray(this.listItem, event.previousIndex, event.currentIndex);
  // console.log(this.selectedItem);
  
}

shareDisplay(_id){
 return this.selectedItems?.find((el)=>el._id===_id)?.share;
}
ngOnChanges(changes: SimpleChanges) {
  
  // console.log(changes);
  this.shareMemberList= this.memberListShare;
  this.selectedItem = this.selectedItems;
  this.colorArray=this.selectedItem.map((el)=>el._id);
  console.log(this.selectedItem);
  
}

ngOnInit(): void {
  // console.log(this.memberListShare);
  
  if (this._route.url==='/will/createWill') {
    this.currentRoute=this._route.url
  }
  
  }

}
