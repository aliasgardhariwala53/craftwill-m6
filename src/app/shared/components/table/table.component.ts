import { Component, OnInit,Input, Output ,EventEmitter, OnChanges, SimpleChanges, HostListener, ViewChild, ElementRef} from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {
  @ViewChild('dropdown')
  public dropdown: ElementRef;
  @Input() tableHeadings;
  @Input() tableData = [];
  @Input() classes ;
  @Input() actionTemplate;
  @Input() keys = [];
  @Input() avtarType='name';
  @Input() emptyTableMessage = '';
  @Input() actionRoute = '';
  @Input() actionList = true;
  @Input() actionToggle = true;
  @Input() headerToggle = true;
  @Input() positionDropdown = 'relative';
  @Input() marginDropdown = 'mt-2';
  // @Input() marginDropdown = 'mt-9 sm:mt-6 mr-1';

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
  positionHandler(i){
    if (i===0) {
      //console.log(i);
      return 'fixed';
      
    }
    return 'relative'
  }
  scrolldown=false;
  drophandler(k,tableData){
    if (k+1 ===tableData.length) {
      
      this.scrolldown=true
    }
  }
  onCancelDelete(){
    this.toggleModalTutorial=false;
    this.selectedItem=null;
  }
  getShortName(fullName) { 
    //console.log(fullName);
    
    if (fullName) {
      return fullName?.split(' ')?.map(n => n[0])?.join('')?.toUpperCase();
    } else {
      return "AA"
    }
   
  }
  // @HostListener('window:scroll', ['$event']) 
  // scrollHandler(event) {
  //   //console.log(this.dropdown);
  //   const data=false;
  //   this.dropdown['open']=data;
  // }
  ngOnInit(): void {
    //console.log(this.classes);
    
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);
    
  }

}
