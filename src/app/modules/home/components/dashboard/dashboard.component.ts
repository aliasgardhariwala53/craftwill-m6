import { Component,OnChanges, OnInit, ViewChild ,SimpleChanges} from '@angular/core';
import { ChartData, ChartDataset } from 'chart.js';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user.service';
import { BehaviorSubject } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';

import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss',]
})
export class DashboardComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  constructor( private _userServ: UserService,  private route: ActivatedRoute, private _router: Router,) {}
  profile=false;
  quickStats : any ;
  totalNetWorth : any;
  totalAssets : any ;
  totalLiabilities : any ;
  totalAssetsInTrust : any ;
  assetStats : any= [40,40,40,40,40,40,40,40,40,40] ;
  liablityStats : any= [40,40,40,40,40,40,40,40,40,40] ;


  public barChartOptions = {
    scales: {
      x: {},
      y: {
        min: 10
      }
    },
    plugins: {
      legend: {
        display: false,
      },


      // datalabels: {
      //   anchor: 'end',
      //   align: 'end'
      // }
    },
    display: false ,
    lineWidth: 5,
    responsive: true,
  };

  public barChartData = {
    labels: ['January', 'February', 'March', 'April','May','June','July','Aug', 'Sept' , 'Oct' , 'Nov' , 'Dec'],
    datasets: [{
      label: 'Statics',
      backgroundColor: '#00C5E9',
      borderRadius: 50,
      barPercentage: 0.4,
      borderColor: '#00C5E9',

      data: this.assetStats,
    },
    {
      label: 'Statics',
      backgroundColor: '#FFCB67',
      borderColor: '#FFCB67',
      borderRadius: 50,
      barPercentage: 0.4,
      data: this.liablityStats,
    }],

  };

  public barChartOptions1 = {
    scales: {
      x: {},
      y: {
        min: 10
      }
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    display: false ,
    lineWidth: 5,
    responsive: true,
  };

  public barChartData1 = {
    labels: ['Paul', 'Charlie', 'John', 'Shimon','Mayur','Julie','Tarun','Neha', 'Deepak' , 'Vivek' , 'Sandy' , 'lovely'],
    datasets: [{
      label: 'Distribution Rate',
      backgroundColor: '#00C5E9',
      borderRadius: 50,
      barPercentage: 0.4,
      borderColor: '#00C5E9',
      data: [40,40,40,40,40,40,40,40,40,40,40,40],
    }],

  };

  QuickStats() {
    this._userServ.dashboardStats().subscribe((result) => {
      // this.quickStats = result;
      this.totalNetWorth = result.totalNetWorth.amount ;
      this.totalAssets = result.totalAssets.amount ;
      this.totalLiabilities = result.totalLiabilities.amount;
      this.totalAssetsInTrust = result.totalAssetsInTrust.amount ;
    })
  }

  GraphData() {
    this._userServ.dashboardGraph('"monthNumber": 12').subscribe((result) => {
      this.quickStats = result;
      this.assetStats = result.assetStats.data;
      this.liablityStats = result.liabilitiesStats.data;
      this.barChartData.datasets[0].data = [this.assetStats]
      this.barChartData.datasets[1].data = [this.liablityStats]
      this.chart.chart.update();
      console.log(this.quickStats);
    });
  }

  ngOnInit(): void {
    this.QuickStats() ;
    this.GraphData();

  this.route.queryParams.subscribe(({ profile }) => {
    if (profile==="true") {
      console.log(profile);
      this._router.navigate(['home/profile']);
    }
  });
  }

}
