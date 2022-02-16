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
  selector: 'app-real-estate',
  templateUrl: './real-estate.component.html',
  styleUrls: ['./real-estate.component.scss'],
})
export class RealEstateComponent implements OnInit {
  realEstateForm: FormGroup;
  id: string='';
  fromCreateWill: string;
  memberData=[];
assetsResidualType
  responseMessage: string;
backRouteLink="/assets/createAssets";
forwardRouteLink="/assets"


      
  toggleModalTutorial:boolean;
  
  constructor(
    private _fb: FormBuilder,
    private assetsServices: AssetsService,
    private spinner: NgxUiLoaderService,
    private _route: Router,
    private toastr: ToastrService,
    private route:ActivatedRoute,
    private memberServices: MembersService
  ) {}
  public countries: any = countries;
key = ['fullname', 'Relationship'];
  classes = ['font-bold', 'font-bold', 'text-sm'];
  slectedResidualMembers = [];

  createForm() {
    this.realEstateForm = this._fb.group({
      address: ['', [Validators.required]],
      country: [, [Validators.required]],
      specifyOwnershipType: ['', [Validators.required]],
    });
    this.realEstateForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.realEstateForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
  }
  formErrors = {
    address: '',
    country: '',
    specifyOwnershipType: '',
  };

  formErrorMessages = {
    address: {
      required: 'Address is Required',
    },
    country: {
      required: 'Country is Required',
    },

    specifyOwnershipType: {
      required: 'Ownership is Required',
    },
  };
  addRealEstatet() {
    console.log(this.realEstateForm);

    if (this.realEstateForm.invalid) {
      this.realEstateForm.markAllAsTouched();
      this.formErrors = valueChanges(
        this.realEstateForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
      console.log('invalid');

      return;
    }
    this.spinner.start();
    const realEstateData = {
      country: this.realEstateForm.value.country,
      specifyOwnershipType: this.realEstateForm.value.specifyOwnershipType,
      realEstate: this.realEstateForm.value,
      type: 'realEstate',
    };

    this.assetsServices.addAssets(realEstateData).subscribe((result) => {
      this.spinner.stop();
      if (result.success) {
        this.realEstateForm.reset();
        this._route.navigate(['/assets/assetsuccess'],{queryParams:{y:'will'}});
      }
      this.toastr.message(result.message, result.success);
    },(err)=>{
      this.spinner.stop();
      this.toastr.message(errorHandler(err),false);
        });
  }
  addSharesMember(value){
    console.log(value);
    
  }
  onUpdateRealEstate() {
    this.spinner.start();
    const realEstateData = {
      country: this.realEstateForm.value.country,
      specifyOwnershipType: this.realEstateForm.value.specifyOwnershipType,
      realEstate: this.realEstateForm.value,
      type: 'realEstate',
    };
    this.assetsServices
      .updateAssets(realEstateData, this.id)
      .subscribe((result) => {
        this.spinner.stop();
        if (result.success) {
          this.realEstateForm.reset();
          this._route.navigate([this.forwardRouteLink]);
        }

        this.toastr.message(result.message, result.success);
      },(err)=>{
        this.spinner.stop();
        this.toastr.message("Something Went Wrong!!!",false);
          });
  }
    getdata(id) {
    this.spinner.start();
    this.assetsServices.getAssets().subscribe((result) => {
      this.spinner.stop();
      console.log(result);

      const data = result.data.filter((item, i) => {
        if (item._id === id) {
          const { realEstate, country, specifyOwnershipType } = item;
          this.realEstateForm.patchValue({
            address: realEstate.address,
            country,
            specifyOwnershipType,
          });
          return realEstate;
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
          this.backRouteLink="/assets/createAssets";
          
          this.fromCreateWill = x;
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
