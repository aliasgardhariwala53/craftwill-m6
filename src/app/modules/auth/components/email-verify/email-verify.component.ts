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
  selector: 'app-email-verify',
  templateUrl: './email-verify.component.html',
  styleUrls: ['./email-verify.component.scss']
})
export class EmailVerifyComponent implements OnInit {
  emailVerifyForm: FormGroup;
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
    this.emailVerifyForm = this._fb.group(
      {
        id: null,
      },
   
    );

  }


 

  resetPassword() {
    this.spinner.start();
    this.emailVerifyForm.value.id = this._actRoute.snapshot.params['id'];

    this._authServ
      .verifyEmail({
        id: this.emailVerifyForm.value.id,
      })
      .subscribe((result) => {
        this.spinner.stop();
        if (result.success) {
          this.emailVerifyForm.reset();
          localStorage.setItem('user', result.token);
          this._router.navigate(['/home/'], { queryParams:{profile:"true"}});
        }
        this.toastr.message(result.message, result.success);
      },(err)=>{
        this.spinner.stop();
        this.toastr.message("Something Went Wrong!!!",false);
          });
  }

  ngOnInit(): void {
    this.createForm();
    this.resetPassword()
  }
}
