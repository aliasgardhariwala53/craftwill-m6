import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-listmembers',
  templateUrl: './listmembers.component.html',
  styleUrls: ['./listmembers.component.scss', '../../../../app.component.scss'],
})
export class ListmembersComponent implements OnInit {
  toggleModal: boolean;
  MemberData = [];
  organisationData = [];
  allMemberData = [];
  memberFilterData = [];
  memberType = [
    'Person',
     'Organisation', 
    ];
    ownershipFilter=['Sole','joint'];
    countryFilter=['in','en'];
  constructor(public route: Router, private _userServ: UserService) {}

  tableHeadings = [
    'Name of the member',
    'Relationship',
    'Gender',
    'ID type',
    'ID number',
    'Birth date',
  ];
  nameType = 'fullname' || 'organisationName';
  tableKeys = [
    'fullname',
    'Relationship',
    'gender',
    'id_type',
    'id_number',
    'dob',
  ];
  tableData = [];
  classes = [
    'w-10/12 m-0 sm:w-5/12 md: break-words capitalize ',
    'w-10/12 m-0 sm:w-1/12 break-words capitalize text',
    'w-1/12 break-words hidden md:flex ',
    'w-1/12 break-words hidden md:flex ',
    'w-1/12 break-words hidden md:flex ',
    'w-1/12 break-words hidden md:flex ',
  ];

  onClickAction(value) {
    console.log(value);
  }
  onFilterHandler(value) {
    console.log('helllooo', value);
    this._userServ.filterMembers(value).subscribe((result) => {
      console.log(result);
      this.memberFilterData = result.map((items, i) => {
        return {
          fullname: this.getName(items).fullname,
          Relationship: this.getName(items).Relationship,
          gender: this.getName(items).gender,
          id_number: this.getName(items).id_number,
          id_type: this.getName(items).id_type,
          type: items.type,
        };
      });
      this.allMemberData = [...this.memberFilterData];
    });
  }
  onSorting(value) {
    if (value === 'All') {
      this.allMemberData = this.MemberData;
    } else {
      this.allMemberData = this.MemberData.filter(
        (item) => item.type === value
      );
    }
  }
  getName(item) {
    let data = {
      fullname: '',
      Relationship: '',
      gender: '',
      id_type:'',
      id_number:'',
    };
    switch (item.type) {
      case 'memberAsPerson':
        data.fullname = item.memberAsPerson.fullname || '';
        data.Relationship = item.memberAsPerson.Relationship || '---';
        data.gender = item.memberAsPerson.gender || '';
        data.id_type = item.memberAsPerson.id_type || '';
        data.id_number = item.memberAsPerson.id_number || '';
        return data;
        break;
      case 'memberAsOrganisation':
        data.Relationship =  '---';
        data.fullname = item.memberAsOrganisation.organisationName || '';
        data.gender = item.memberAsOrganisation.gender || '';
        data.id_type = item.memberAsOrganisation.gender || '';
        data.id_number = item.memberAsOrganisation.gender || '';
        return data;
        break;

    
      default:
        return data;
    }
  }
  ngOnInit(): void {
    this._userServ.getMembers().subscribe((result) => {
      // console.log(result.data);

      this.MemberData = result.data.map((items, i) => {
        console.log(items);
    
        return {
          fullname: this.getName(items).fullname,
          Relationship: this.getName(items).Relationship,
          gender: this.getName(items).gender,
          id_number: this.getName(items).id_number,
          id_type: this.getName(items).id_type,
          type: items.type,
        };
      });
      this.allMemberData = [...this.MemberData];
      // console.log(this.allMemberData);
    });
  }
}
