import { Component, OnInit ,Input} from '@angular/core';
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
  constructor(private route:Router) { }

  ngOnInit(): void {
    console.log(this.routerlink);
    
  }

  routeTo(){
    this.route.navigate([this.routerlink]);
  }

}
