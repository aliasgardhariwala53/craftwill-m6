import { Component, OnInit,Input, Output ,EventEmitter} from '@angular/core';


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
  @Input() class=[];
  @Input() keys = [];
  @Input() avtarType='name';
  @Input() emptyTableMessage = '';
  @Output() actionButton = new EventEmitter();
  constructor() { }

  onClickActionButton(ItemId){
    this.actionButton.emit(ItemId);
  }
  getShortName(fullName) { 
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
