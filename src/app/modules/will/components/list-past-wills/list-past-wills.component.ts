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
  constructor(private _userServ:UserService,
     private _willServices: WillService,
    private _router: Router,
    private toastr: ToastrService,
    private spinner: NgxUiLoaderService) { }
  tableHeadings = [
    'File Version',
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
  ngOnInit(): void {
    this.searchForm.valueChanges.pipe(debounceTime( 200 )  ).subscribe((e) => {
      console.log(e);
      this.onChangehandler();
    });
    this._willServices.getAllWill().subscribe(
      (result) => {
        this.spinner.stop();
        this.allWillData = result.data.users.map((items, i) => {
          console.log(items.willName);
          console.log(items);
          return {
           ...items,image:'../../../../../assets/Icons/latestVersion.svg',actionRoute:'will/createWill'
          };
        });
        this.displayWilldata = [...this.allWillData];
      },
      (err) => {
        this.spinner.stop();
      }
    );
  }

}
