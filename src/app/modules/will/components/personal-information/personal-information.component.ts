import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';
import { WillService } from 'src/app/services/will.service';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit {
  @Input() reviewDisable=false;
  @Output() onClickNextBtn = new EventEmitter();
  constructor(private _fb:FormBuilder,     private spinner: NgxUiLoaderService, private _userServ: UserService,private _willServices: WillService) {
   

   }
  idList = ['NRIC', 'Passport', 'FIN', 'Others'];
  genderList = ['Male', 'Female', 'Other'];
  userInfo: FormGroup;
  pageTitle;
  step=1;
  createForm() {
    this.userInfo = this._fb.group({
      id_number: ['',[Validators.required,
        Validators.pattern('[a-zA-Z0-9]*'),
        Validators.maxLength(16),
      ]],
      id_type: [ ,Validators.required],
      fullName: ['',[Validators.required, Validators.pattern('[a-zA-Z ]*'),Validators.maxLength(32)]],
      gender: [, [Validators.required]],
      email: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
      ],],
      floorNumber: ['', [Validators.required, Validators.maxLength(6)]],
      unitNumber: ['', [Validators.required, Validators.maxLength(6)]],
      streetName: ['',[Validators.required,Validators.maxLength(64)] ],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(12)]],
      assetScope: ['singapore',Validators.required],
    });

    this.userInfo.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.userInfo,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });

  }
  formErrors = {
    id_type: '',
    id_number: '',
    gender: '',
    fullName: '',
    email: '',
    floorNumber: '',
    unitNumber: '',
    streetName: '',
    postalCode: '',
    assetScope: '',

  };
  onClickNext(){
        if (this.userInfo.invalid) {
      //console.log('is 2');
      this.userInfo.markAllAsTouched();
      this.formErrors = valueChanges(
        this.userInfo,
        { ...this.formErrors },
        this.formErrorMessages
      );
      return;
    }
    this.profileUpdate();
    this.onClickNextBtn.emit(2);
    this._willServices.step1.next(this.userInfo.value);
  }
  formErrorMessages = {
    id_type: {
      required: 'Id type is required.',
    },
    id_number: {
      required: 'Id number is required.',
      maxlength: 'Please enter valid id number',
      pattern: 'Invalid id number',
    },
    gender: {
      required: 'Gender is required.',
    },
    fullName: {
      required: 'Full name is required.',
      maxlength: 'Word limit Exceed..',
      pattern: 'Please enter valid name',
    },
    email: {
      required: 'Email is required.',
      pattern: 'Please enter valid email address.For example johndoe@domain.com ',
    },
    password: {
      required: 'Password is required.',
      minlength: 'Minimum length of password must be 6',
    },
    floorNumber: {
      required: 'Floor number is required.',
      maxlength: 'Please Enter valid floor number',
    },
    unitNumber: {
      required: 'Unit number is required.',
      maxlength: 'Please enter valid unit Number',
    },
    streetName: {
      required: 'Street name is required.',
      maxlength: 'Word limit Exceed..',
    },
    postalCode: {
      required: 'Postal code is required.',
      pattern: 'Please enter valid numeric value',
      maxlength: 'Please enter valid postal code',
    },
    assetScope: {
      required: 'Asset Scope is required.',
    },

  };
  profileUpdate() {
    if (this.userInfo.invalid) {
      this.userInfo.markAllAsTouched();
      this.formErrors = valueChanges(
        this.userInfo,
        { ...this.formErrors },
        this.formErrorMessages
      );
      return;
    }
    this.spinner.start();
    const profiledate = {
      ...this.userInfo.value,
      gender: this.userInfo.value.gender?.toLowerCase(),
    };
    this._userServ.updateProfile(profiledate).subscribe(
      (result) => {
        if (result.success) {
          
          this.spinner.stop();
        }
        this.spinner.stop();
      },(err)=>{
        this.spinner.stop();
          });
  }
  ngOnInit(): void {
    this.createForm();
    if (this.reviewDisable) {
      this.userInfo.disable();
    }
    this._willServices.step1.subscribe((step1Data) => {
      console.log(step1Data);
      this.userInfo.patchValue(step1Data);
     
    });
    this._userServ.getProfile().subscribe(
      (result) => {
        console.log(( (({ subscriptionData, ...o }) => o)(result.data)) );
        
        this._willServices.step1.next(( (({ subscriptionData, ...o }) => o)(result.data)) );
        this.spinner.stop();
        // this.userInfo.setValue({
        //   ...result.data,
        //   gender:
        //     result.data.gender.charAt(0).toUpperCase() +
        //     result.data.gender.slice(1),
        // });

      },(err)=>{
        this.spinner.stop();
          });
  }

}
