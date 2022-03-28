import {
  Component,
  OnChanges,
  OnInit,
  ViewChild,
  SimpleChanges,
  HostListener,
} from '@angular/core';
import { ChartData, ChartDataset } from 'chart.js';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user.service';
import { BehaviorSubject } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';

import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('chartOne') chartOne: BaseChartDirective;
  @ViewChild('chartTwo') chartTwo: BaseChartDirective;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  constructor(
    private _userServ: UserService,
    private route: ActivatedRoute,
    private _router: Router,
    private spinner: NgxUiLoaderService,
  ) {}
  profile = false;
  quickStats: any;
  totalNetWorth: any;
  totalAssets: any;
  totalLiabilities: any;
  totalAssetsInTrust: any;
  assetStats: any = [40, 40, 40, 40, 40, 40, 40, 40, 40, 40];
  liablityStats: any = [40, 40, 40, 40, 40, 40, 40, 40, 40, 40];
  assetsDistribution: any = [50, 40, 60, 40, 40, 40, 40, 40, 40, 40];

  public barChartOptions = {
    scales: {
      x: {},
      y: {
        min: 0,
      },
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
    display: false,
    lineWidth: 5,
    responsive: true,
  };
  labelData=[];
  public barChartData = {
    labels: [
      'Paul',
      'Charlie',
      'John',
      'Shimon',
      'Mayur',
      'Julie',
      'Tarun',
      'Neha',
      'Deepak',
      'Vivek',
      'Sandy',
      'lovely',
    ],
    datasets: [
      {
        label: 'Assets',
        backgroundColor: '#00C5E9',
        borderRadius: 50,
        barPercentage: 0.4,
        borderColor: '#00C5E9',

        data: this.assetStats,
      },
      {
        label: 'Liabilities',
        backgroundColor: '#FFCB67',
        borderColor: '#FFCB67',
        borderRadius: 50,
        barPercentage: 0.4,
        data: this.liablityStats,
      },
    ],
  };

  public barChartOptions1 = {
    scales: {
      x: {},
      y: {
        min: 0,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    display: false,
    lineWidth: 5,
    responsive: true,
    maintainAspectRatio: false,
  };
  heightChart1;
  public barChartData1 = {
    labels: [
      'Paul',
      'Charlie',
      'John',
      'Shimon',
      'Mayur',
      'Julie',
      'Tarun',
      'Neha',
      'Deepak',
      'Vivek',
      'Sandy',
      'lovely',
    ],
    datasets: [
      {
        label: 'Distribution Rate',
        backgroundColor: '#00C5E9',
        borderRadius: 50,
        barPercentage: 0.4,
        borderColor: '#00C5E9',
        data: this.assetsDistribution,
      },
    ],
  };

  QuickStats() {
    this._userServ.dashboardStats().subscribe((result) => {
      // this.quickStats = result;
      console.log(result);
      this.totalNetWorth = result.totalNetWorth.amount;
      this.totalAssets = result.totalAssets.amount;
      this.totalLiabilities = result.totalLiabilities.amount;
      this.totalAssetsInTrust = result.totalAssetsInTrust.amount;
    });
  }
  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   console.log(window.innerWidth);
  //   if(window.innerWidth>578){
  //     let data = null;
  //     data =25;
  //     this.heightChart1=data;
  //     console.log(this.heightChart1);
  //   }
  // }
  GraphData() {
    this._userServ.dashboardGraph('"monthNumber": 12').subscribe((result) => {
      this.spinner.stop();
      this.quickStats = result;
      
      console.log(this.quickStats);
      
      const newDataAssets=Object.keys(this.quickStats?.assets)?.map((el)=>{
        console.log(el);
        const month =el?.split('-')[0].toLowerCase();
        const year =el?.split('-')[1];
      return  {month,year,value:this.quickStats.assets[el]}
      })
      const newDataLiability=Object.keys(this.quickStats?.liabilities)?.map((el)=>{
        console.log(el);
        const month =el?.split('-')[0].toLowerCase();
        const year =el?.split('-')[1];
      return  {month,year,value:this.quickStats.liabilities[el]}
      })
      console.log(newDataAssets);
      this.labelData=result.assets?.map((el)=>el.month);
      this.assetStats=newDataAssets?.map((el)=>el.value);
      this.liablityStats =newDataLiability?.map((el)=>el.value);

      console.log(newDataAssets?.map((el)=>el.value));
      console.log(newDataLiability?.map((el)=>el.value));
      this.barChartData.labels=this.labelData;
      this.barChartData.datasets[0] = { ...this.barChartData.datasets[0], data: this.assetStats};
      const newDataTwo = {
        labels: [],
        datasets: []
      };
      newDataTwo.labels= newDataAssets?.map((el)=>el.month);
      newDataTwo.datasets[0] = { ...this.barChartData.datasets, label: 'Assets',
      backgroundColor: '#00C5E9',
      borderRadius: 50,
      barPercentage: 0.4,
      borderColor: '#00C5E9',
       data: this.assetStats};

      newDataTwo.datasets[1] = {...this.barChartData.datasets, label: 'Liabilities',
      backgroundColor: '#FFCB67',
      borderColor: '#FFCB67',
      borderRadius: 50,
      barPercentage: 0.4,
      data: this.liablityStats?.map((el)=>el.value)};
        this.barChartData = newDataTwo;
      this.chartOne.chart?.render();
    });
  }
    GraphData2() {
      this._userServ.dashboardGraph('"monthNumber": 12').subscribe((result) => {
        this.spinner.stop();
        this.quickStats = result;
        
        console.log(this.quickStats.data);
        
        const newData=Object?.keys(this.quickStats?.data || {})?.map((el)=>{
          console.log(el);
          const month =el?.split('-')[0]?.toLowerCase();
          const year =el?.split('-')[1];
        return  {month,year,value:this.quickStats.data[el]}
        })
        console.log(newData);
        this.labelData=newData?.map((el)=>el.month);
        this.assetsDistribution =newData?.map((el)=>el.value);
        console.log(newData?.map((el)=>el.value));
        const newDataTwo = {
          labels: [],
          datasets: []
        };
        newDataTwo.labels= newData?.map((el)=>el.month);
        newDataTwo.datasets[0] = { ...this.barChartData1.datasets,label: 'Distribution Rate',
        backgroundColor: '#00C5E9',
        borderRadius: 50,
        barPercentage: 0.4,
        borderColor: '#00C5E9', data: newData?.map((el)=>el.value)};
        this.barChartData1 = newDataTwo;
        this.chartTwo.chart?.render();
      });
    }

  ngOnInit(): void {
    this.spinner.start();
    this.QuickStats();
    this.GraphData();
    this.GraphData2();

    this.route.queryParams.subscribe(({ profile }) => {
      if (profile === 'true') {
        console.log(profile);
        this._router.navigate(['home/profile']);
      }
    });
  }
}
