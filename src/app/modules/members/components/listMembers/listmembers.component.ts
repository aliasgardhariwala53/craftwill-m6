import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-listmembers',
  templateUrl: './listmembers.component.html',
  styleUrls: ['./listmembers.component.scss', '../../../../app.component.scss'],
})
export class ListmembersComponent implements OnInit {
  searchForm = new FormControl(null);
  toggleModal: boolean;
  toggleModalTutorial: boolean = false;
  showSearch: boolean = false;

  MemberData = [];
  organisationData = [];
  allMemberData = [];
  memberFilterData = [];
  memberSearchData = [];
  memberType = ['Person', 'Organisation'];
  ownershipFilter = ['Sole', 'joint'];
  countryFilter = ['india'];
  constructor(
    public route: Router,
    private _userServ: UserService,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService
  ) {}

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
  onChangehandler() {
    console.log(this.searchForm.value);
    if (!this.searchForm.value) {
      this.allMemberData = [...this.MemberData];
    }
    this.allMemberData = this.MemberData.filter((items) => {
      return items.fullname
        .toLowerCase()
        .includes(this.searchForm.value.toLowerCase());
    });
  }
  onFilterHandler(value) {
    this.spinner.start();
    console.log('helllooo', value);
    this._userServ.filterMembers(value).subscribe((result) => {
      this.spinner.stop();
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
      id_type: '',
      id_number: '',
      dob: '',
    };
    switch (item.type) {
      case 'memberAsPerson':
        data.fullname = item.memberAsPerson.fullname || '';
        data.Relationship = item.memberAsPerson.Relationship || '---';
        data.gender = item.memberAsPerson.gender || '';
        data.id_type = item.memberAsPerson.id_type || '';
        data.id_number = item.memberAsPerson.id_number || '';
        data.dob = item.memberAsPerson.dob || '';

        return data;
        break;
      case 'memberAsOrganisation':
        data.Relationship = '---';
        data.fullname = item.memberAsOrganisation.organisationName || '';
        data.gender = item.memberAsOrganisation.gender || 'NA';
        data.id_type = item.memberAsOrganisation.gender || 'NA';
        data.id_number = item.memberAsOrganisation.registration_number || '';
        data.dob = item.memberAsOrganisation.dob || 'NA';
        return data;
        break;

      default:
        return data;
    }
  }
  ngOnInit(): void {
    this.spinner.start();
    this._userServ.getMembers().subscribe(
      (result) => {
        // console.log(result.data);
        this.spinner.stop();
        this.MemberData = result.data.map((items, i) => {
          console.log(items);

          return {
            fullname: this.getName(items).fullname,
            Relationship: this.getName(items).Relationship,
            gender: this.getName(items).gender,
            id_number: this.getName(items).id_number,
            id_type: this.getName(items).id_type,
            dob: this.getName(items).dob,
            type: items.type,
            _id: items._id,
            actionRoute: 'members/createmembers',
          };
        });
        this.allMemberData = [...this.MemberData];
        // console.log(this.allMemberData);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message('Error Getting Members data !!', false);
      }
    );
  }
}
