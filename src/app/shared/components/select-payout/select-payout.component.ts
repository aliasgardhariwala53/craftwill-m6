import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-select-payout',
  templateUrl: './select-payout.component.html',
  styleUrls: ['./select-payout.component.scss']
})
export class SelectPayoutComponent implements OnInit {
  @Input() addItemTitle;
  @Input() key=[];
  @Input() listItem=[];
  @Input() classes;
  @Input() keyOfPayoutMember;
  @Input() classesOfPayoutMember;
  @Input() disableSelect=false;
  @Input() dragToggle:boolean=true;
  @Input() togglePayoutDetail:boolean=true;
  @Input() selectedItems:Array<any>=[];
          selectedItem: Array<any>=[];
  colorArray=[];
  @Output() onSelectId=new EventEmitter;
  @Output() onClickAddPayout=new EventEmitter;
  shareIdInputArray=[];
  displayMembers=[];
  allAppointMembers=[];
  constructor() { }
drop(event: CdkDragDrop<string[]>) {
  if(this.disableSelect){
    return;
  }
  moveItemInArray(this.listItem, event.previousIndex, event.currentIndex);
  // console.log(this.selectedItem);
  
}
getShortName(obj) { 
  const name =obj[Object.keys(obj)[0]];
  if (name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substr(0,2);;
  } else {
    return "AA"
  }
 
}
mergeById (a1, a2) { 
  return a1.map(itm => ({
       ...a2.find((item) => (item._id === itm._id) && item),
       ...itm
   }))};
onSelectItem(value){
  if(this.disableSelect){
    return;
  }
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
delete(index: any) {
  this.listItem.splice(index,1);
}
checkId(id){
  console.log(this.selectedItem?.includes((el)=>el._id===id), id);
  
  return this.selectedItem?.includes((el)=>el._id===id)
}
onAddItem(){
  this.onClickAddPayout.emit();
}
benificiary=true;
x;
memberhadler(trustId,i){
  console.log(this.allAppointMembers);
  
  this.x=this.allAppointMembers.filter((el)=>(el?.trustId === trustId))[i];
  // this.benificiary=(x?.ifBenificiaryAttains===x?.ifBenificiaryIs===x?.customField===x?.ifBenificiaryTurns==='');
  this.benificiary=this.x?.ifBenificiaryAttains==="" && this.x?.ifBenificiaryIs==="" && this.x?.customField==="" && this.x?.ifBenificiaryTurns==="";
  return this.allAppointMembers.filter((el)=>el?.trustId === trustId)[i]?.appointBenificiaries;
}
ngOnChanges(changes: SimpleChanges) {
  this.selectedItem = this.selectedItems;
  this.allAppointMembers = this.listItem;
 
  console.log(this.listItem);
}
  ngOnInit(): void {
    console.log(this.listItem);
  }

}
