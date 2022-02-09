import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { countries } from 'src/app/shared/utils/countries-store';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss'],
})
export class BusinessComponent implements OnInit {
  businessForm: FormGroup;
  responseMessage: string;
  id: string='';
  constructor(
    private _fb: FormBuilder,
    private _userServ: UserService,
    private _route: Router,
    private toastr: ToastrService,
    private spinner:NgxUiLoaderService,
    private route:ActivatedRoute,
  ) {}
  public countries:any = countries
  createForm() {
    this.businessForm = this._fb.group({
      businessName: ['', [Validators.required]],
      UEN_no: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      country: [, [Validators.required]],
      specifyOwnershipType: ['', [Validators.required]],
    });
    this.businessForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.businessForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
  }
  formErrors = {
    businessName: '',
    UEN_no: '',
    country: '',
    specifyOwnershipType: '',
  };

  formErrorMessages = {
    businessName: {
      required: 'Business Name  is Required',
    },
    UEN_no: {
      required: 'UEN No. is Required',

      pattern: 'Only numeric values allowed',
    },
    country: {
      required: 'Country is Required',
    },

    specifyOwnershipType: {
      required: 'Ownership is Required',
    },
  };
  addBusiness() {
   
    console.log(this.businessForm);

    if (this.businessForm.invalid) {
      this.businessForm.markAllAsTouched();
      this.formErrors = valueChanges(
        this.businessForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
      console.log('invalid');

      return;
    }
    this.spinner.start();
    const businessData = {
      country: this.businessForm.value.country,
      specifyOwnershipType: this.businessForm.value.specifyOwnershipType,
      business: this.businessForm.value,
      type:'business'
    };
    this._userServ.addAssets(businessData).subscribe((result) => {
      this.spinner.stop();
      this.toastr.message(result.message,result.success);
      if (result.success) {
        this.businessForm.reset();
        this._route.navigate(['/assets/assetsuccess']);
      }
    
    });
  }
  onUpdateBusiness(){
    this.spinner.start();
    const businessData = {
      country: this.businessForm.value.country,
      specifyOwnershipType: this.businessForm.value.specifyOwnershipType,
      business: this.businessForm.value,
      type:'business'
    };
    this._userServ.updateAssets(businessData,this.id).subscribe((result) => {
      this.spinner.stop();
      if (result.success) {
        this.businessForm.reset();
        this._route.navigate(['/assets']);
      }
     
      this.toastr.message(result.message, result.success);
    });
  }
  getdata(id) {
    this.spinner.start();
    this._userServ.getAssets().subscribe((result) => {
      this.spinner.stop();
      console.log(result);
      
      const data=result.data.filter((item,i)=>{
        if (item._id===id) {
          const {business,country,specifyOwnershipType} = item;
          this.businessForm.patchValue({
            businessName: business.businessName,
            UEN_no: business.UEN_no,
            country: country,
             specifyOwnershipType: specifyOwnershipType,
          })     
          return business;
        }
        return null;
      })
      console.log(data);
      

     
    });
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(({id})=>{
      if (id) {
        this.id=id;
        this.getdata(id);
      }
    })
    this.createForm();
  }
}
