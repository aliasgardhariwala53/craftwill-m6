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
  @Input() y;
  @Input() wid;
  @Input() x;
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
 if (this.y || this.x || this.wid) {
   this.route.navigate([`${this.routerlink}`], { queryParams: {
     wid: this.wid?this.wid:null,
     y: this.y?this.y:null,
     x: this.x?this.x:null,
   }
   });
   return;
 }
  
      this.route.navigate([this.routerlink]);
    }
    
      this.backButtonHandler.emit();
    
  }     

}
