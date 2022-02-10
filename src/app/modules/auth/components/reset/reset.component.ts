import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  passwordValidation,
  valueChanges,
} from 'src/app/helper/formerror.helper';
import { AuthservicesService } from 'src/app/services/authservices.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent implements OnInit {
  resetForm: FormGroup;
  message: string;

  constructor(
    private _authServ: AuthservicesService,
    private _fb: FormBuilder,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private toastr: ToastrService,
    private spinner: NgxUiLoaderService
  ) {}

  createForm() {
    this.resetForm = this._fb.group(
      {
        _id: null,
        password: ['', [Validators.required, Validators.minLength(6)]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      {
        validators: [passwordValidation.match('password', 'newPassword')],
      }
    );

    this.resetForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.resetForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
  }

  formErrors = {
    password: '',
    newPassword: '',
  };

  formErrorMessages = {
    password: {
      required: 'New Password is Required',
      minlength: 'Minimum length must be 6',
    },
    newPassword: {
      required: 'Confirm Password is Required',
      minlength: 'Minimum length must be 6',
      matching: 'New Password and confirm password should be same',
    },
  };

  resetPassword() {
    console.log(this.resetForm.value);
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      this.formErrors = valueChanges(
        this.resetForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
      return;
    }
    this.spinner.start();
    this.resetForm.value._id = this._actRoute.snapshot.params['id'];

    this._authServ
      .resetPassword({
        _id: this.resetForm.value._id,
        newPassword: this.resetForm.value.password,
      })
      .subscribe((result) => {
        this.spinner.stop();
        if (result.success) {
          this.resetForm.reset();
          this._router.navigate(['/login']);
        }
        this.toastr.message(result.message, result.success);
      },(err)=>{
        this.spinner.stop();
        this.toastr.message("Something Went Wrong!!!",false);
          });
  }

  ngOnInit(): void {
    this.createForm();
  }
}
