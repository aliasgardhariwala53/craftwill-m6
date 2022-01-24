import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-listmembers',
  templateUrl: './listmembers.component.html',
  styleUrls: ['./listmembers.component.scss','../../../../app.component.scss'],
})

export class ListmembersComponent implements OnInit {
  memberType:string="person";
  personData = [];
  organisationData = [];
  constructor(public route: Router, private _userServ: UserService) {}

  tableHeadings = [
    'Name of the member',
    'Relationship',
    'Gender',
    'ID type',
    'ID number',
    'Birth date',
  ];
  tableKeys = ['fullname', 'Relationship', 'gender', 'id_type', 'id_number','dob'];
  tableData = [
  ];
   classes=[
    "w-10/12 m-0 sm:w-6/12 break-words capitalize ",
    "w-10/12 m-0 sm:w-1/12 break-words capitalize text",
    "w-1/12 break-words hidden sm:block ",
    "w-1/12 break-words hidden sm:block ",
    "w-1/12 break-words hidden sm:block ",
    "w-1/12 break-words hidden sm:block ",
    
    ]
    
    onClickAction(value){
      console.log(value);
      
    }
  ngOnInit(): void {
    this._userServ.getPerson().subscribe((result) => {
      console.log(result.message);
      
      this.personData = result.data.map((item) => {
        return item;
      });
    });
    this._userServ.getOrganisation().subscribe((result) => {
      console.log(result.data);
      this.organisationData.push(...result.data)
      console.log(this.organisationData);
    });
  }
}
