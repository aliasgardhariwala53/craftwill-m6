import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { errorHandler, valueChanges } from 'src/app/helper/formerror.helper';
import { AssetsService } from 'src/app/services/assets.service';
import { MembersService } from 'src/app/services/members.service';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { countries } from 'src/app/shared/utils/countries-store';

@Component({
  selector: 'app-personal-possession',
  templateUrl: './personal-possession.component.html',
  styleUrls: ['./personal-possession.component.scss'],
})
export class PersonalPossessionComponent implements OnInit {
  id: string = '';
  fromCreateWill: string;
assetsResidualType
  personalPossessionForm: FormGroup;
  responseMessage: string;
backRouteLink="/assets/createAssets";
forwardRouteLink="/assets"


      
  toggleModalTutorial:boolean;
  
  memberData=[];
  constructor(
    private _fb: FormBuilder,
    private assetsServices: AssetsService,
    private spinner: NgxUiLoaderService,
    private _route: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private memberServices: MembersService
  ) {}
  public countries: any = countries;
key = ['fullname', 'Relationship'];
  classes = ['font-bold', 'font-bold', 'text-sm'];
  slectedResidualMembers = [];
  createForm() {
    this.personalPossessionForm = this._fb.group({
      Name: ['', [Validators.required]],
      id_No: ['', [Validators.pattern('^[0-9]*$')]],
      country: [, [Validators.required]],
      specifyOwnershipType: ['', [Validators.required]],
    });
    this.personalPossessionForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.personalPossessionForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
  }
  formErrors = {
    Name: '',
    id_No: '',
    country: '',
    specifyOwnershipType: '',
  };

  formErrorMessages = {
    Name: {
      required: 'Name  is Required',
    },
    id_No: {
      pattern: 'Only numeric values allowed',
    },
    country: {
      required: 'Country is Required',
    },

    specifyOwnershipType: {
      required: 'Ownership is Required',
    },
  };
  addPossession() {
    console.log(this.personalPossessionForm);

    if (this.personalPossessionForm.invalid) {
      this.personalPossessionForm.markAllAsTouched();
      this.formErrors = valueChanges(
        this.personalPossessionForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
      console.log('invalid');

      return;
    }
    this.spinner.start();
    const possessionData = {
      country: this.personalPossessionForm.value.country,
      specifyOwnershipType:
        this.personalPossessionForm.value.specifyOwnershipType,
      personalPossession: this.personalPossessionForm.value,
      type: 'personalPossession',
    };
    this.assetsServices.addAssets(possessionData).subscribe((result) => {
      this.spinner.stop();
      if (result.success) {
        this.personalPossessionForm.reset();
        if (this.fromCreateWill==='will') {
            this._route.navigate(['/assets/assetsuccess'],{queryParams:{y:'will'}});
          } else {
            this._route.navigate(['/assets/assetsuccess']);
          }
      }
      this.toastr.message(result.message, result.success);
    },(err)=>{
      this.spinner.stop();
      this.toastr.message(errorHandler(err),false);
        });
  }
 addSharesMember(value){
    console.log(value)
  }
  onUpdatePossessionData() {
    this.spinner.start();
    const possessionData = {
      country: this.personalPossessionForm.value.country,
      specifyOwnershipType:
        this.personalPossessionForm.value.specifyOwnershipType,
      personalPossession: this.personalPossessionForm.value,
      type: 'personalPossession',
    };
    this.assetsServices.updateAssets(possessionData, this.id).subscribe((result) => {
      this.spinner.stop();
      if (result.success) {
        this.personalPossessionForm.reset();
        this._route.navigate([this.forwardRouteLink]);
      }

      this.toastr.message(result.message, result.success);
    },(err)=>{
      this.spinner.stop();
      this.toastr.message(errorHandler(err),false);
        });
  }
    getdata(id) {
    this.spinner.start();
    this.assetsServices.getAssets().subscribe((result) => {
      this.spinner.stop();
      console.log(result);

      const data = result.data.filter((item, i) => {
        if (item._id === id) {
          const { personalPossession, country, specifyOwnershipType } = item;
          this.personalPossessionForm.patchValue({
            Name: personalPossession.Name,
            id_No: personalPossession.id_No,
            country,
            specifyOwnershipType,
          });
          return personalPossession;
        }
        return null;
      });
      console.log(data);
    },(err)=>{
      this.spinner.stop();
      this.toastr.message(errorHandler(err),false);
        });
  }
  ngOnInit(): void {
 this.route.queryParams.subscribe(({id,x,y})=>{
     if (id) {
        this.id = id;
        this.getdata(id);
        if (x) {
    this.backRouteLink="/will/createWill";      
 this.forwardRouteLink="/will/createWill";  
        }
      }
      if (y==='will') {
        this.backRouteLink="/will/createWill"; 
  this.forwardRouteLink="/will/createWill";   
        this.fromCreateWill = y;
        console.log(this.fromCreateWill);
      }
    });
    this.memberServices.getMembers().subscribe(
      (result) => {
        // console.log(result.data);
        this.spinner.stop();
        this.memberData = result.data.map((items, i) => {
          console.log(items);

          return {
            fullname: this.memberServices.getMembersData(items).fullname,
            Relationship:
              this.memberServices.getMembersData(items).Relationship,
            gender: this.memberServices.getMembersData(items).gender,
            id_number: this.memberServices.getMembersData(items).id_number,
            id_type: this.memberServices.getMembersData(items).id_type,
            dob: this.memberServices.getMembersData(items).dob,
            type: items.type,
            _id: items._id,
            actionRoute: 'members/createmembers',
          };
        });
        // console.log(this.allMemberData);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message('Error Getting Members data !!', false);
      }
    );   this.createForm();
  }
}
