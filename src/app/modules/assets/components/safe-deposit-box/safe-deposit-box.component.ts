import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { countries } from 'src/app/shared/utils/countries-store';

@Component({
  selector: 'app-safe-deposit-box',
  templateUrl: './safe-deposit-box.component.html',
  styleUrls: ['./safe-deposit-box.component.scss'],
})
export class SafeDepositBoxComponent implements OnInit {
  id: string = '';
  safeDepositboxForm: FormGroup;
  responseMessage: string;
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
    this.safeDepositboxForm = this._fb.group({
      safe_Box_Location: ['', [Validators.required]],
      safe_No: ['', [Validators.pattern('^[0-9]*$')]],
      country: [, [Validators.required]],
      specifyOwnershipType: ['', [Validators.required]],
    });
    this.safeDepositboxForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.safeDepositboxForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
  }
  formErrors = {
    safe_Box_Location: '',
    safe_No: '',
    country: '',
    specifyOwnershipType: '',
  };

  formErrorMessages = {
    safe_Box_Location: {
      required: 'Safe Box Location  is Required',
    },
    safe_No: {
      pattern: 'Only numeric values allowed',
    },
    country: {
      required: 'Country is Required',
    },

    specifyOwnershipType: {
      required: 'Ownership is Required',
    },
  };
  addDepositbox() {
    console.log(this.safeDepositboxForm);

    if (this.safeDepositboxForm.invalid) {
      this.safeDepositboxForm.markAllAsTouched();
      this.formErrors = valueChanges(
        this.safeDepositboxForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
      console.log('invalid');

      return;
    }
    this.spinner.start();
    const safeDepositData = {
      country: this.safeDepositboxForm.value.country,
      specifyOwnershipType: this.safeDepositboxForm.value.specifyOwnershipType,
      safeDepositBox: this.safeDepositboxForm.value,
      type: 'safeDepositBox',
    };
    this._userServ.addAssets(safeDepositData).subscribe((result) => {
      this.spinner.stop();
      if (result.success) {
        this.safeDepositboxForm.reset();
        this._route.navigate(['/assets/assetsuccess']);
      }
      this.toastr.message(result.message, result.success);
    });
  }
  onUpdateSafeDepositBox() {
    this.spinner.start();
    const safeDepositData = {
      country: this.safeDepositboxForm.value.country,
      specifyOwnershipType: this.safeDepositboxForm.value.specifyOwnershipType,
      safeDepositBox: this.safeDepositboxForm.value,
      type: 'safeDepositBox',
    };
    this._userServ
      .updateAssets(safeDepositData, this.id)
      .subscribe((result) => {
        this.spinner.stop();
        if (result.success) {
          this.safeDepositboxForm.reset();
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
          const { safeDepositBox, country, specifyOwnershipType } = item;
          this.safeDepositboxForm.patchValue({
            safe_Box_Location:safeDepositBox.safe_Box_Location,
            safe_No: safeDepositBox.safe_No,
            country,
            specifyOwnershipType,
          });
          return safeDepositBox;
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
