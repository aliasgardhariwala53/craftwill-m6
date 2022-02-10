import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { errorHandler, valueChanges } from 'src/app/helper/formerror.helper';
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
  personalPossessionForm: FormGroup;
  responseMessage: string;
  constructor(
    private _fb: FormBuilder,
    private _userServ: UserService,
    private spinner: NgxUiLoaderService,
    private _route: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}
  public countries: any = countries;
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
    this._userServ.addAssets(possessionData).subscribe((result) => {
      this.spinner.stop();
      if (result.success) {
        this.personalPossessionForm.reset();
        this._route.navigate(['/assets/assetsuccess']);
      }
      this.toastr.message(result.message, result.success);
    },(err)=>{
      this.spinner.stop();
      this.toastr.message(errorHandler(err),false);
        });
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
    this._userServ.updateAssets(possessionData, this.id).subscribe((result) => {
      this.spinner.stop();
      if (result.success) {
        this.personalPossessionForm.reset();
        this._route.navigate(['/assets']);
      }

      this.toastr.message(result.message, result.success);
    },(err)=>{
      this.spinner.stop();
      this.toastr.message(errorHandler(err),false);
        });
  }
    getdata(id) {
    this.spinner.start();
    this._userServ.getAssets().subscribe((result) => {
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
    this.route.queryParams.subscribe(({ id }) => {
      if (id) {
        this.id = id;
        this.getdata(id);
      }
    });
    this.createForm();
  }
}
