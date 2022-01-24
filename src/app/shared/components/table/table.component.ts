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
  @Input() emptyTableMessage = '';
  @Output() actionButton = new EventEmitter();
  constructor() { }

  onClickActionButton(ItemId){
    this.actionButton.emit(ItemId);
  }
  ngOnInit(): void {
    console.log(this.classes);
    
  }

}
