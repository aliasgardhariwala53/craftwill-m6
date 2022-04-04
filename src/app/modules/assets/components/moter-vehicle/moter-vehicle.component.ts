import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { errorHandler, valueChanges } from 'src/app/helper/formerror.helper';
import { AssetsService } from 'src/app/services/assets.service';
import { MembersService } from 'src/app/services/members.service';
import { UserService } from 'src/app/services/user.service';
import { WillService } from 'src/app/services/will.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';

import { countries } from 'src/app/shared/utils/countries-store';

@Component({
  selector: 'app-moter-vehicle',
  templateUrl: './moter-vehicle.component.html',
  styleUrls: ['./moter-vehicle.component.scss'],
})
export class MoterVehicleComponent implements OnInit {
  id: string = '';
  fromCreateWill: string;
  assetsResidualType;
  vehicleForm: FormGroup;
  memberData = [];
  slectedResidualMembers = [];
  allAssetsBeneficiary = [];
  assetsBeneficiary = [];
  responseMessage: string;
  backRouteLink = '/assets';
  forwardRouteLink = '/assets';
  totalShareMessage= false;
  wid='';
  toggleModalTutorial: boolean;
  constructor(
    private _fb: FormBuilder,
    private assetsServices: AssetsService,
    private spinner: NgxUiLoaderService,
    private _route: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private memberServices: MembersService,
    private _willServices: WillService
  ) {}
  public countries: any = countries;
  key = ['fullname', 'Relationship'];
  classes = ['font-bold', 'font-bold', 'text-sm'];

  GiftBenificiary = [];
  shareData = [];
  createForm() {
    this.vehicleForm = this._fb.group({
      CarModel: ['', [Validators.required,Validators.pattern('^[a-zA-Z ]*$'),Validators.maxLength(32)]],
      plateNo: ['', [Validators.required, Validators.pattern('^[0-9]*$'),Validators.maxLength(8)]],
      country: [, [Validators.required]],
      specifyOwnershipType: ['', [Validators.required]],
estimateValue: ['', [Validators.required, Validators.pattern('^[0-9]*$'),Validators.maxLength(16)]],
    });
    this.vehicleForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.vehicleForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
  }
  formErrors = {
    CarModel: '',
    plateNo: '',
    country: '',
    estimateValue: '',
 specifyOwnershipType: '',
  };

  formErrorMessages = {
    CarModel: {
      required: 'Vehicle Model is required.',
      pattern: 'Please Enter Valid model name',
      maxlength: 'Word limit Exceed..',
    },
    plateNo: {
      required: 'Plate No  is required.',
      maxlength: 'Please Enter Valid plate Number',
      pattern: 'Only numeric values allowed',
    },
    country: {
      required: 'Country is required.',
    },

    specifyOwnershipType: {
      required: 'Ownership is required.',
    },
    estimateValue: {
      required: 'Estimate value is required.',
      maxlength: 'Please enter valid number',
 pattern: 'Only numeric values allowed',
    },
  };
  addVehicle() {
    //console.log(this.vehicleForm);

    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      this.formErrors = valueChanges(
        this.vehicleForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
        //console.log('invalid');

      return;
    }

    var totalShare = this.assetsBeneficiary.map((el)=>Number(el.share) || 0).reduce((prev,curr)=>prev+curr,0);
    //console.log(totalShare);
    //console.log(this.assetsBeneficiary);
    //console.log(this.allAssetsBeneficiary);

    if(totalShare != 100 && this.fromCreateWill === 'will'){
      this.totalShareMessage = true;
      return ;
    }
    this.totalShareMessage = false;
    this.spinner.start();
    const VehicletData = {
      country: this.vehicleForm.value.country,
      specifyOwnershipType: this.vehicleForm.value.specifyOwnershipType,
      estimateValue: this.vehicleForm.value.estimateValue,
      motorVehicle: this.vehicleForm.value,
      type: 'motorVehicle',
    };
    this.assetsServices.addAssets(VehicletData).subscribe(
      (result) => {
        this.spinner.stop();
        if (result.success) {
          this.vehicleForm.reset();
          if (this.fromCreateWill === 'will') {
            this._route.navigate(['/assets/assetsuccess'], {
              queryParams: { y: 'will' },
            });
          } else if (this.fromCreateWill === 'secure') {
            this._route.navigate(['/assets/assetsuccess'], {
              queryParams: { y: 'secure' },
            });
          } else {
            this._route.navigate(['/assets/assetsuccess']);
          }
        }
        this.toastr.message(result.message, result.success);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message(errorHandler(err), false);
      }
    );
  }

  onUpdateMotorVehicle() {
    var totalShare = this.assetsBeneficiary.map((el)=>Number(el.share) || 0).reduce((prev,curr)=>prev+curr,0);
    //console.log(totalShare);
    //console.log(this.assetsBeneficiary);
    //console.log(this.allAssetsBeneficiary);

    if(totalShare != 100 && this.fromCreateWill === 'will'){
      this.totalShareMessage = true;
      return ;
    }
    this.totalShareMessage = false;
    this.spinner.start();
    const VehicletData = {
      country: this.vehicleForm.value.country,
      specifyOwnershipType: this.vehicleForm.value.specifyOwnershipType,
      estimateValue: this.vehicleForm.value.estimateValue,
      motorVehicle: this.vehicleForm.value,
      type: 'motorVehicle',
    };
    this.assetsServices.updateAssets(VehicletData, this.id).subscribe(
      (result) => {
        this.spinner.stop();
        if (result.success) {
          const myItem = this.allAssetsBeneficiary.findIndex(
            (el) => el.assetId===this.id
          );
          if (myItem === -1) {
            this.allAssetsBeneficiary.push(...this.assetsBeneficiary);
          } else {
            this.allAssetsBeneficiary = this.allAssetsBeneficiary.filter(
              (el) => el.assetId!==this.id
            );
            this.allAssetsBeneficiary = [
              ...this.allAssetsBeneficiary,
              ...this.assetsBeneficiary,
            ];
          }
          //console.log(this.allAssetsBeneficiary);
    
            this._willServices.assetsBeneficiary.next(this.allAssetsBeneficiary);
      
          this.vehicleForm.reset();
          if (this.wid !== '') {
            this._route.navigate([`${this.forwardRouteLink}`], { queryParams:{wid:this.wid}});
            return;
          }
          this._route.navigate([this.forwardRouteLink]);
        }

        this.toastr.message(result.message, result.success);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message('Something Went Wrong!!!', false);
      }
    );
  }
  getdata(id) {
    this.spinner.start();
    this.assetsServices.getAssets().subscribe(
      (result) => {
        this.spinner.stop();
        //console.log(result);

        const data = result.data.filter((item, i) => {
          if (item._id === id) {
            const { motorVehicle, country, specifyOwnershipType ,estimateValue} = item;
            this.vehicleForm.patchValue({
              CarModel: motorVehicle.CarModel,
              plateNo: motorVehicle.plateNo,
              country: country,
              specifyOwnershipType: specifyOwnershipType,
              estimateValue,
            });
            return motorVehicle;
          }
          return null;
        });
        //console.log(data);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message(errorHandler(err), false);
      }
    );
  }
  addSharesMember(value) {
    //console.log(value);  
    this.assetsBeneficiary= value.map((el)=>{return{...el,assetId:this.id}})
    //console.log(this.assetsBeneficiary);
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe(({ id, x, y,wid }) => {
      if (id) {
        this.id = id;
        this.getdata(id);
        if (x) {
          this.backRouteLink = '/will/createWill';
          this.forwardRouteLink = '/will/createWill';
        }
      }
      if (y === 'will') {
        this.backRouteLink = '/will/createWill';
        this.forwardRouteLink = '/will/createWill';
        this.fromCreateWill = y;
        this.wid=wid
        //console.log(this.wid);
        //console.log(this.fromCreateWill);
      }
      if (y === 'secure') {
        this.backRouteLink = '/liabilities/securedLoan';
        this.forwardRouteLink = '/liabilities/securedLoan';
        this.fromCreateWill = y;
      }
if (y === 'myWill') {
        this.backRouteLink = '/will/myWills';
        this.forwardRouteLink = '/will/myWills';
        this.fromCreateWill = y;
        //console.log(this.fromCreateWill);
      }
    });
    this._willServices.assetsBeneficiary.subscribe((value) => {
      this.allAssetsBeneficiary=value;
      //console.log("assetsBeneficiary",value);
      this.slectedResidualMembers = this.allAssetsBeneficiary?.filter(
        (el) =>  el.assetId === this.id
      );
     this.assetsBeneficiary = this.allAssetsBeneficiary?.filter(
        (el) =>  el.assetId === this.id
      );
   
    });
    this.memberServices.getMembers().subscribe(
      (result) => {
        // //console.log(result.data);
        this.spinner.stop();
        this.memberData = result.data.map((items, i) => {
          //console.log(items);

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
        // //console.log(this.allMemberData);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message('Error Getting Members data !!', false);
      }
    );
    this.createForm();
  }
}
