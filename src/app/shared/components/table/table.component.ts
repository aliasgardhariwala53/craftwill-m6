import { Component, OnInit,Input, Output ,EventEmitter} from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() tableHeadings;
  @Input() tableData = [];
  @Input() classes ;
  @Input() actionTemplate;
  @Input() keys = [];
  @Input() avtarType='name';
  @Input() emptyTableMessage = '';
  @Input() actionRoute = '';
  @Output() actionButton = new EventEmitter();
  constructor(private _route:Router) { }

  onClickActionButton(Item){
    this.actionButton.emit(Item._id);
    if (this._route.url=='/will/myWills') {
      this._route.navigate([`${Item.actionRoute}`], { queryParams:{id:Item._id,y:'myWill'}});
      return;
    }
    if (this._route.url=='/will/pastWills') {
      this._route.navigate([`${Item.actionRoute}`], { queryParams:{wid:Item._id,y:'myWill'}});
      return;
    }
    this._route.navigate([`${Item.actionRoute}`], { queryParams:{id:Item._id}})
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

}
