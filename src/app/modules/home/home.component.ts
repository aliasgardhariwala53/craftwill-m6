import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss','../../app.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(    private route: ActivatedRoute, private _router: Router,) { }
profile=false;
 ngOnInit(): void {
  this.route.queryParams.subscribe(({ profile }) => {
    if (profile==="true") {
      console.log(profile);
      this._router.navigate(['home/profile']);
    }
    
  });
  }

}
