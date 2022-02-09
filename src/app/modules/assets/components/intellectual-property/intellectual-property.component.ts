import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { countries } from 'src/app/shared/utils/countries-store';

@Component({
  selector: 'app-intellectual-property',
  templateUrl: './intellectual-property.component.html',
  styleUrls: ['./intellectual-property.component.scss'],
})
export class IntellectualPropertyComponent implements OnInit {
  IntellectualPropertyForm: FormGroup;
  responseMessage: string;
  id: string = '';
  constructor(
    private _fb: FormBuilder,
    private _userServ: UserService,
    private spinner: NgxUiLoaderService,
    private _route: Router,
    private toastr: ToastrService,
    private route:ActivatedRoute,
  ) {}
  public countries: any = countries;
  createForm() {
    this.IntellectualPropertyForm = this._fb.group({
      ip_Name: ['', [Validators.required]],
      ip_No: ['', [Validators.pattern('^[0-9]*$')]],
      country: [, [Validators.required]],
      SpecifyOwnershipType: ['', [Validators.required]],
    });
    this.IntellectualPropertyForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.IntellectualPropertyForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
  }
  formErrors = {
    ip_Name: '',
    ip_No: '',
    country: '',
    SpecifyOwnershipType: '',
  };

  formErrorMessages = {
    ip_Name: {
      required: 'Ip Name  is Required',
    },
    ip_No: {
      pattern: 'Only numeric values allowed',
    },
    country: {
      required: 'Country is Required',
    },

    SpecifyOwnershipType: {
      required: 'Ownership is Required',
    },
  };
  addProperty() {
    console.log(this.IntellectualPropertyForm);

    if (this.IntellectualPropertyForm.invalid) {
      this.IntellectualPropertyForm.markAllAsTouched();
      this.formErrors = valueChanges(
        this.IntellectualPropertyForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
      console.log('invalid');

      return;
    }
    this.spinner.start();
    const intellectualData = {
      country: this.IntellectualPropertyForm.value.country,
      specifyOwnershipType:this.IntellectualPropertyForm.value.SpecifyOwnershipType,
      intellectualProperty: this.IntellectualPropertyForm.value,
      type: 'intellectualProperty',
    };
    this._userServ.addAssets(intellectualData).subscribe((result) => {
      this.spinner.stop();
      if (result.success) {
        this.IntellectualPropertyForm.reset();
        this._route.navigate(['/assets/assetsuccess']);
      }
      this.toastr.message(result.message, result.success);
    });
  }
  onUpdateIntellectualProperty() {
    this.spinner.start();
    const intellectualData = {
      country: this.IntellectualPropertyForm.value.country,
      specifyOwnershipType:
        this.IntellectualPropertyForm.value.specifyOwnershipType,
      intellectualProperty: this.IntellectualPropertyForm.value,
      type: 'intellectualProperty',
    };
    this._userServ
      .updateAssets(intellectualData, this.id)
      .subscribe((result) => {
        this.spinner.stop();
        if (result.success) {
          this.IntellectualPropertyForm.reset();
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

      const data = result.data.filter((item, i) => {
        if (item._id === id) {
          const { intellectualProperty, country, specifyOwnershipType } = item;
          this.IntellectualPropertyForm.patchValue({
            ip_Name: intellectualProperty.ip_Name,
            ip_No: intellectualProperty.ip_No,
            country: country,
            SpecifyOwnershipType: specifyOwnershipType,
          });
          return intellectualProperty;
        }
        return null;
      });
      console.log(data);
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
