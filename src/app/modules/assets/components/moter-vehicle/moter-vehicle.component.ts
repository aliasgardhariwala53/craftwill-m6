import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { countries } from 'src/app/shared/utils/countries-store';

@Component({
  selector: 'app-moter-vehicle',
  templateUrl: './moter-vehicle.component.html',
  styleUrls: ['./moter-vehicle.component.scss'],
})
export class MoterVehicleComponent implements OnInit {
  id: string = '';
  vehicleForm: FormGroup;
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
    this.vehicleForm = this._fb.group({
      CarModel: ['', [Validators.required]],
      plateNo: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      country: [, [Validators.required]],
      SpecifyOwnershipType: ['', [Validators.required]],
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
    SpecifyOwnershipType: '',
  };

  formErrorMessages = {
    CarModel: {
      required: 'Vehicle Model is Required',
    },
    plateNo: {
      required: 'Plate No  is Required',

      pattern: 'Only numeric values allowed',
    },
    country: {
      required: 'Country is Required',
    },

    SpecifyOwnershipType: {
      required: 'Ownership is Required',
    },
  };
  addVehicle() {
    console.log(this.vehicleForm);

    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      this.formErrors = valueChanges(
        this.vehicleForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
      console.log('invalid');

      return;
    }
    this.spinner.start();
    const VehicletData = {
      country: this.vehicleForm.value.country,
      specifyOwnershipType: this.vehicleForm.value.specifyOwnershipType,
      motorVehicle: this.vehicleForm.value,
      type: 'motorVehicle',
    };
    this._userServ.addAssets(VehicletData).subscribe((result) => {
      this.spinner.stop();
      if (result.success) {
        this.vehicleForm.reset();
        this._route.navigate(['/assets/assetsuccess']);
      }
      this.toastr.message(result.message, result.success);
    });
  }
  onUpdateMotorVehicle() {
    this.spinner.start();
    const VehicletData = {
      country: this.vehicleForm.value.country,
      specifyOwnershipType: this.vehicleForm.value.specifyOwnershipType,
      motorVehicle: this.vehicleForm.value,
      type: 'motorVehicle',
    };
    this._userServ
      .updateAssets(VehicletData, this.id)
      .subscribe((result) => {
        this.spinner.stop();
        if (result.success) {
          this.vehicleForm.reset();
          this._route.navigate(['/assets']);
        }

        this.toastr.message(result.message, result.success);
      });
  }
  getdata(id) {
    this._userServ.getAssets().subscribe((result) => {
      this.spinner.stop();
      console.log(result);

      const data = result.data.filter((item, i) => {
        if (item._id === id) {
          const { motorVehicle, country, specifyOwnershipType } = item;
          this.vehicleForm.patchValue({
            CarModel: motorVehicle.CarModel,
            plateNo: motorVehicle.plateNo,
            country: country,
            SpecifyOwnershipType: specifyOwnershipType,
          });
          return motorVehicle;
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
