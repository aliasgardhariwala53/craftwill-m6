import { Component, OnInit,Input, Output ,EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {
  @Input() tableHeadings;
  @Input() tableData = [];
  @Input() classes ;
  @Input() actionTemplate;
  @Input() keys = [];
  @Input() avtarType='name';
  @Input() emptyTableMessage = '';
  @Input() actionRoute = '';
  @Input() actionList = true;
  @Input() headerToggle = true;
  @Input() viewAction = true;
  @Input() editAction = true;
  @Input() deleteAction = true;
  @Output() actionButton = new EventEmitter();
  @Output() deleteItem = new EventEmitter();
  constructor(private _route:Router) { }
  toggleModalTutorial: boolean = false;
  deletbtn = 'deletbtn';
  selectedItem;
  onClickActionButton(Item){
 
    this.actionButton.emit(Item._id);
    // if (this._route.url=='/will/myWills') {
    //   this._route.navigate([`${Item.actionRoute}`], { queryParams:{id:Item._id,y:'myWill'}});
    //   return;
    // }
    if (this._route.url=='/will/myWills') {
      this._route.navigate([`${Item.actionRoute}`], { queryParams:{wid:Item._id,y:'myWill'}});
      return;
    }
    this._route.navigate([`${Item.actionRoute}`], { queryParams:{id:Item._id}})
  }
  onDeleteHandler(Item){
    this.toggleModalTutorial=true;
    this.selectedItem = Item;
  }
  onClickViewButton(Item){
    this.actionButton.emit(Item._id);
    // if (this._route.url=='/will/myWills') {
    //   this._route.navigate([`${Item.actionRoute}`], { queryParams:{id:Item._id,re:'true',y:'myWill'}});
    //   return;
    // }
    if (this._route.url=='/will/myWills') {
      this._route.navigate([`${Item.actionRoute}`], { queryParams:{wid:Item._id,re:'true',y:'myWill'}});
      return;
    }
    this._route.navigate([`${Item.actionRoute}`], { queryParams:{id:Item._id,re:'true'}})
  }
  onDelete(){
    this.deleteItem.emit(this.selectedItem);
    this.selectedItem=null;
    this.toggleModalTutorial=false;
  }
  onCancelDelete(){
    this.toggleModalTutorial=false;
    this.selectedItem=null;
  }
  getShortName(fullName) { 
    console.log(fullName);
    
    if (fullName) {
      return fullName.split(' ').map(n => n[0]).join('').toUpperCase();
    } else {
      return "AA"
    }
   
  }
  ngOnInit(): void {
    console.log(this.classes);
    
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    
  }

}
