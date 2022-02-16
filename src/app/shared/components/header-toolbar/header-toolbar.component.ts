import { Component, OnInit ,Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-toolbar',
  templateUrl: './header-toolbar.component.html',
  styleUrls: ['./header-toolbar.component.scss']
})
export class HeaderToolbarComponent implements OnInit {

  @Input() pagetitle:string;
  @Input() routerlink:string;
  @Input() showpagetitle:boolean;
  @Input() showSearchbar:boolean;
  @Input() showbackbutton:boolean;
  @Input() headerMenuIcon:boolean=false;
  @Input() notificatioIcon:boolean=false;
  @Output() backButtonHandler =new EventEmitter();
  constructor(private route:Router) { }
  toggleModal:boolean;
  ngOnInit(): void {
    console.log(this.routerlink);
    
  }

  routeTo(){
    if (this.routerlink) {
      this.route.navigate([this.routerlink]);
    }
    
      this.backButtonHandler.emit();
    
  }     

}
