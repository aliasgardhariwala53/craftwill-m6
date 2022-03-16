import { Component,OnChanges, OnInit, ViewChild ,SimpleChanges} from '@angular/core';
import { ChartData, ChartDataset } from 'chart.js';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user.service';
import { BehaviorSubject } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../../app.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  constructor( private _userServ: UserService,  private route: ActivatedRoute, private _router: Router,) {}
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
