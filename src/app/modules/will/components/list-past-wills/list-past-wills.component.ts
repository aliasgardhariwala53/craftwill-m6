import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { debounceTime } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { WillService } from 'src/app/services/will.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
@Component({
  selector: 'app-list-past-wills',
  templateUrl: './list-past-wills.component.html',
  styleUrls: ['./list-past-wills.component.scss']
})
export class ListPastWillsComponent implements OnInit {
  searchForm = new FormControl('');
  showSearch: boolean = false;
  allWillData=[];
  pastWillData=[];
  displayWilldata=[];
  latestWilldata=[];
  constructor(private _userServ:UserService,
     private _willServices: WillService,
     public router: Router,
    private toastr: ToastrService,
    private _route: Router,
    private spinner: NgxUiLoaderService) { }
  tableHeadings = [
    'Past Versions',
    'Date & Time',

  ];
  tableHeadingslatest = [
    'Latest Version',
    'Date & Time',

  ];
  tableKeys = ['willName', 'DATE'];
  tableData = [
  ];
  classes=[
    "w-10/12 m-0 sm:w-9/12 break-words capitalize ",
    "w-10/12 m-0 sm:w-2/12 break-words capitalize text",
    ]

    onClickAction(value){
      this._willServices.globalReload.next(true);
      console.log(value);
      
    }
    onChangehandler() {
      console.log(this.searchForm.value);
      if (!this.searchForm.value || this.searchForm.value === null) {
        this.displayWilldata = [...this.allWillData];
      }

      this.displayWilldata = this.allWillData.map((items) => {
        for (const property in items) {
          console.log(items[property]);
          if(items[property].toString().toLowerCase().includes(this.searchForm.value.toLowerCase())){
            return items
          }
        }
      }).filter(items => items!== undefined);
      console.log(this.displayWilldata);
    }
    focusMethod() {
      this.showSearch=!this.showSearch;
      setTimeout(() => {
        document.getElementById("mySearchField").focus();    
      }, 0);
    }
    version(arr){
      let x=0;
      let y=0;
     return arr?.map((el,i)=>{
       y++;
       if (i%10 === 0) {
         x++;
         y=0;
         return `${x}.${y}`
       }
       return `${x}.${y}`
     })
    }
    currentWill(){
      this._route.navigate(['/will/createWill'], {
        queryParams: { id: this.latestWillId}});
    }
    deleteItemHandler(item) {
      this.spinner.start();
      this._willServices.deleteWill(item._id).subscribe(
        (result) => {
          console.log(result);
          this.spinner.stop();
          if (result.success == true) {
            this.allWillData = this.allWillData.filter((el) => el._id !== item._id);
    
            this.toastr.message('Will Deleted', true);
            this.displayWilldata = [...this.allWillData];
        this.displayWilldata = this.displayWilldata.reverse();
        this.latestWilldata = this.displayWilldata.length > 0 ?[this.displayWilldata[0]] : [];
        this.displayWilldata = this.displayWilldata.filter((el,i)=>i!==0);
          }
        },
        (err) => {
          console.log(err);
          this.spinner.stop();
          this.toastr.message('Error deleting Will data !!', false);
        }
      );
    }
    latestWillId='';
    willpresent=false;
  ngOnInit(): void {
    this.spinner.start();
    this._willServices.willpresent.subscribe((result)=>{
      this.willpresent=result;
    });
    this.searchForm.valueChanges.pipe(debounceTime( 200 )  ).subscribe((e) => {
      console.log(e);
      this.onChangehandler();
    });
    this._willServices.getAllWill().subscribe(
      (result) => {
        
        if (result.data.length > 0 ) {
          this._willServices.willpresent.next(true);
          console.log(result.data?.length);
          console.log(this._willServices.willpresent.getValue());
          
        }
        const versionArray=this.version(result?.data);
        this.allWillData = result.data?.map((items, i) => {
          console.log(items.willName);
          console.log(items);
          return {
           ...items,image:'../../../../../assets/Icons/latestVersion.svg',actionRoute:'will/createWill',willName:`My will Version ${versionArray[i]}`
          };
        });
        this.displayWilldata = [...this.allWillData];
        this.displayWilldata = this.displayWilldata.reverse();
        this.latestWilldata = this.displayWilldata.length > 0 ?[this.displayWilldata[0]] : [];
        this.displayWilldata = this.displayWilldata.filter((el,i)=>i!==0);
        
        this.spinner.stop();
      },
      (err) => {
        this.spinner.stop();
      }
    );
  }

}