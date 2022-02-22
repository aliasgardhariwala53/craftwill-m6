import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { debounceTime } from 'rxjs';
import { MembersService } from 'src/app/services/members.service';
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
  backRouteLink="/home";   
  fromCreateWill:string;   
  MemberData = [];
  organisationData = [];
  allMemberData = [];
  memberFilterData = [];
  memberSearchData = [];
  memberType = ['Member As Person', 'Member As Organisation'];
  ownershipFilter = ['Sole', 'joint'];
  countryFilter = ['india'];
  constructor(
    public _route: Router,
    private memberServices: MembersService,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
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
    this.allMemberData = this.MemberData.map((items) => {
      for (const property in items) {
        console.log(items[property]);
        if(items[property].toString().toLowerCase().includes(this.searchForm.value.toLowerCase())){
          return items
        }
      }
    }).filter(items => items!== undefined);
  }
  onFilterHandler(value) {
    this.spinner.start();
    console.log('helllooo', value);
    this.memberServices.filterMembers(value).subscribe((result) => {
      this.spinner.stop();
      this.memberFilterData = result.map((items, i) => {
        return {
          fullname: this.memberServices.getMembersData(items).fullname,
          Relationship: this.memberServices.getMembersData(items).Relationship,
          gender: this.memberServices.getMembersData(items).gender,
          id_number: this.memberServices.getMembersData(items).id_number,
          id_type: this.memberServices.getMembersData(items).id_type,
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

  ngOnInit(): void {
    this.spinner.start();
    this.searchForm.valueChanges.pipe(debounceTime( 200 )  ).subscribe((e) => {
      console.log(e);
      this.onChangehandler();
    });
    this.memberServices.getMembers().subscribe(
      (result) => {
        // console.log(result.data);
        this.spinner.stop();
        this.MemberData = result.data.map((items, i) => {
          console.log(items);

          return {
            fullname: this.memberServices.getMembersData(items).fullname,
            Relationship: this.memberServices.getMembersData(items).Relationship,
            gender: this.memberServices.getMembersData(items).gender,
            id_number: this.memberServices.getMembersData(items).id_number,
            id_type: this.memberServices.getMembersData(items).id_type,
            dob: this.memberServices.getMembersData(items).dob,
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
