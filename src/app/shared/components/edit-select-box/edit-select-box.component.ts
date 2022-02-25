import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-edit-select-box',
  templateUrl: './edit-select-box.component.html',
  styleUrls: ['./edit-select-box.component.scss']
})
export class EditSelectBoxComponent implements OnInit {
  @Input() allItems;
  @Input() itemsfiltered;
  @Input() addItemTitle='';
  @Input() deletedItemBySelectMobile;
  @Output() getSelectedList=new EventEmitter;
  constructor() { }
  selectedItem=[];
  colorArray=[];
  ngOnInit(): void {
    this.selectedItem = this.allItems.filter(e => this.deletedItemBySelectMobile.indexOf(e) !== -1);
    this.colorArray=this.selectedItem.map((el)=>el._id);
    // console.log(this.selectedItem);
    console.log(this.deletedItemBySelectMobile);
    console.log(this.allItems);
  }
  getShortName(obj) { 
    const name =obj[Object.keys(obj)[0]];
    if (name) {
      return name?.split(' ').map(n => n[0]).join('').toUpperCase().substr(0,2);
    } else {
      return "AA"
    }
   
  }

  onSelectItem(value){

    let selectedObj = this.allItems.filter((el) => el._id === value);
    const myItem = this.selectedItem.findIndex((el) => el._id === value);
    console.log(myItem);
    if (myItem !== -1) {
      this.selectedItem =this.selectedItem.filter((el) => el._id !== value);
      this.getSelectedList.emit(this.selectedItem);
      
    } else { 
    this.selectedItem.push(...selectedObj);
    this.getSelectedList.emit(this.selectedItem);
    }
    this.colorArray=this.selectedItem.map((el)=>el._id)
    console.log(this.selectedItem);
    this.checkId(value)
  }

  checkId(id){
    console.log(this.selectedItem?.includes((el)=>el._id===id), id);
    
    return this.selectedItem?.includes((el)=>el._id===id)
  }
}
