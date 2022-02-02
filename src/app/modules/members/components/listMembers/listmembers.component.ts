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
  MemberData = [];
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
  nameType='fullname' || 'organisationName'
  tableKeys = [this.nameType, 'Relationship', 'gender', 'id_type', 'id_number','dob'];
  tableData = [
  ];
   classes=[
    "w-10/12 m-0 sm:w-5/12 md: break-words capitalize ",
    "w-10/12 m-0 sm:w-1/12 break-words capitalize text",
    "w-1/12 break-words hidden md:flex ",
    "w-1/12 break-words hidden md:flex ",
    "w-1/12 break-words hidden md:flex ",
    "w-1/12 break-words hidden md:flex ",
    
    ]
    
    onClickAction(value){
      console.log(value);
      
    }
  ngOnInit(): void {
    this._userServ.getMembers().subscribe((result) => {
      console.log(result.data);
      
      this.MemberData = result.data.map((item) => {
        console.log(item.memberAsPerson);
        // this.MemberData.push(...item.memberAsOrganisation);
        return item.memberAsPerson || item.memberAsOrganisation;
      });
     
    });

  }
}
