import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { countries } from 'src/app/shared/utils/countries-store';
import { ToastrModule } from 'ngx-toastr';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { errorHandler } from 'src/app/helper/formerror.helper';
import { AssetsService } from 'src/app/services/assets.service';
import { debounce, debounceTime, delay } from 'rxjs';
import { Chart, registerables } from 'chart.js';
@Component({
  selector: 'app-list-assets',
  templateUrl: './list-assets.component.html',
  styleUrls: ['./list-assets.component.scss'],
})
export class ListAssetsComponent implements OnInit {
  searchForm = new FormControl('');
  toggleModal: boolean;
  toggleModalTutorial: boolean = false;
  assetsData = [];
  assetsFilterData = [];
  assetsSearchData = [];
  showSearch: boolean = false;
  tableHeadings = [
    'Name of the Assets',
    'Unique Number',
    'Country',
    'OwnerShip',
  ];
  allAssetsinOne = [];
  allAssetsData = [];

  tableKeys = ['nameofAssets', 'uniqueNumber', 'country', 'ownerShip'];

  tableData = [];
  classes = [
    'w-10/12 m-0 sm:w-7/12 break-words  ',
    'w-10/12 m-0 sm:w-[12%] break-words ',
    'w-1/12 break-words hidden md:flex ',
    'w-1/12 break-words hidden md:flex ',
  ];
  name: string;
  sortType: string;
  title: string = 'Filter Assets';
  lastDate: string;
  assetsType = [
    'Bank Account',
    'Investment Account',
    'Insurance Policy',
    'Business',
    'Real Estate',
    'Motor Vehicle',
    'Intellectual Property',
    'Personal Possession',
    'Safe Deposit Box',
  ];
  ownershipFilter = ['Sole', 'joint'];
  countryFilter = ['india'];

  result: any;
  coinPrice: any;
  liquidData=[];
  chart: any = [];
  constructor(
    private assetsServices: AssetsService,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService
  ) {Chart.register(...registerables);}
  public countries: any = countries;
  onChangehandler() {
    //console.log(this.searchForm.value);
    if (!this.searchForm.value || this.searchForm.value === null) {
      this.allAssetsinOne = [...this.allAssetsData];
    }
    //console.log(this.allAssetsData);
    // let filteredArr = []
    this.allAssetsinOne = this.allAssetsData.map((items) => {
      for (const property in items) {
        //console.log(items[property]);
        if(items[property]?.toString()?.toLowerCase()?.includes(this.searchForm.value?.toLowerCase())){
          return items
        }
      }
    })?.filter(items => items!== undefined);
    //console.log(this.allAssetsinOne);
  }
  onFilterHandler(value) {
    this.spinner.start();
    //console.log('helllooo', value);
    this.assetsServices.filterAssets(value).subscribe(
      (result) => {
        this.spinner.stop();
        this.assetsFilterData = result.map((items, i) => {
          return {
            nameofAssets: this.assetsServices.getAssetsData(items)?.name,
            uniqueNumber: this.assetsServices.getAssetsData(items)?.uniqueNumber,
            country: items.country,
            ownerShip: items.specifyOwnershipType,
            type: items.type,
            actionRoute: this.assetsServices.getAssetsData(items)?.actionRoute,
            image: this.assetsServices.getAssetsData(items)?.img,
            isDeletable:true,
          };
        });
        this.allAssetsinOne = [...this.assetsFilterData];
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message(errorHandler(err), false);
      }
    );
  }

  onClickAction(value) {
    //console.log(value);
  }
 

  onSorting(value) {
    if (value === 'All') {
      this.allAssetsinOne = this.allAssetsData;
    } else {
      this.allAssetsinOne = this.allAssetsData.filter(
        (item) => item.type === value
      );
    }
  }
  focusMethod() {
    this.showSearch=!this.showSearch;
    setTimeout(() => {
      document.getElementById("mySearchField").focus();    
    }, 0);
  }
  arrayData;

  deleteItemHandler(item) {
    this.spinner.start();
    this.assetsServices.deleteAssets(item._id).subscribe(
      (result) => {
        //console.log(result);
        this.spinner.stop();
        if (result.success == true) {
          this.allAssetsData = this.allAssetsData.filter((el) => el._id !== item._id);
          this.allAssetsinOne = this.allAssetsData;
          this.toastr.message('Member Deleted', true);
        }
      },
      (err) => {
        //console.log(err);
        this.spinner.stop();
        this.toastr.message('Error deleting Members data !!', false);
      }
    );
  }
percentage(a,b){
return (a/(a+b) * 100);
}

  ngOnInit(): void {
    this.spinner.start();
    this.searchForm.valueChanges.pipe(debounceTime( 200 )  ).subscribe((e) => {
      //console.log(e);
      this.onChangehandler();
    });
    this.assetsServices.getAssets().subscribe(
      (result) => {
        this.spinner.stop();
        this.allAssetsData = result.data.map((items, i) => {
          console.log(items);
          
          return {
            nameofAssets: this.assetsServices.getAssetsData(items)?.name,
            uniqueNumber: this.assetsServices.getAssetsData(items)?.uniqueNumber,
            country: items.country,
            ownerShip: items.specifyOwnershipType,
            type: items.type,
            _id: items._id,
            actionRoute: this.assetsServices.getAssetsData(items)?.actionRoute,
            image: this.assetsServices.getAssetsData(items)?.img,
            isDeletable:true,
          };
        });
        this.allAssetsinOne = [...this.allAssetsData];
      },
      (err) => {
        this.spinner.stop();
      }
    );
    this.assetsServices.liquidity().subscribe((res) => {
      this.spinner.stop();
      this.result = res;
      // this.coinPrice = this.result.data.coins.map((coins: any) => coins.price);
      
      this.liquidData[0] = this.percentage(this.result?.liquidCount,this.result?.iliquidCount);
      this.liquidData[1] = this.percentage(this.result?.iliquidCount,this.result?.liquidCount);
      // //console.log(this.coinPrice);
      //console.log(this.result);
 

      this.chart = new Chart('canvas', {
        type: 'bar',
        data: {
          labels: ['Liquid', 'iliquid'],
          datasets: [
            {
              borderRadius: 10,
              data: this.liquidData,
              borderColor: ['#00C5E9','#FFCB67'],
              label: '',
              backgroundColor: ['#00C5E9','#FFCB67'],
              borderWidth: 0,
              barThickness:40,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
        indexAxis: "y",
        scales: {
            x: {
              min:0,
              max:100,
                beginAtZero: true,
                ticks: {
                	callback: function(value) {
                  	return value + '%';
                  }
                },
                grid:{
                  display:false,
                }
            },
            y:{
              grid:{
                display:false,
              }
            }
        }
        },
      });
    });
  }
}
