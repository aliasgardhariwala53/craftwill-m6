import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list-past-wills',
  templateUrl: './list-past-wills.component.html',
  styleUrls: ['./list-past-wills.component.scss']
})
export class ListPastWillsComponent implements OnInit {

  pastWillData=[];
  constructor(private _userServ:UserService,private spinner:NgxUiLoaderService) { }
  tableHeadings = [
    'File Version',
    'Date & Time',

  ];
  tableKeys = ['loanName', 'loanProvider'];
  tableData = [
  ];
  classes=[
    "w-10/12 m-0 sm:w-9/12 break-words capitalize ",
    "w-10/12 m-0 sm:w-2/12 break-words capitalize text",
    ]

    onClickAction(value){
      console.log(value);
      
    }
  ngOnInit(): void {
  }

}
