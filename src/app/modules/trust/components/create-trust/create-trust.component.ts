import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
@Component({
  selector: 'app-create-trust',
  templateUrl: './create-trust.component.html',
  styleUrls: [
    './create-trust.component.scss',
    '../../../../app.component.scss',
  ],
})
export class CreateTrustComponent implements OnInit {
  assetsId = [];
  assetsData = [];
  trustData = [];
  id: string = '';
  TrustForm: FormGroup;
  responseMessage: string;
  toggleModalTutorial: boolean = false;
  constructor(
    private _fb: FormBuilder,
    private _userServ: UserService,
    private spinner: NgxUiLoaderService,
    private _route: Router,
    private toastr: ToastrService,
    private _actRoute: ActivatedRoute,
    private route: ActivatedRoute
  ) {}

  createForm() {
    this.TrustForm = this._fb.group({
      trustName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      _id: [''],
    });
    this.TrustForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.TrustForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
  }
  formErrors = {
    trustName: '',
    description: '',
  };

  formErrorMessages = {
    trustName: {
      required: 'Trust Name is Required',
    },

    description: {
      required: 'Description is Required',
    },
  };

  addTrustForm() {
    console.log(this.TrustForm);

    if (this.TrustForm.invalid) {
      this.TrustForm.markAllAsTouched();
      this.TrustForm.markAsDirty();
      this.formErrors = valueChanges(
        this.TrustForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
      console.log('invalid');
      return;
    }
    this.spinner.start();
    console.log(this.TrustForm.value);

    this._userServ.addTrust(this.TrustForm.value).subscribe((result) => {
      this.spinner.stop();
      if (result.success) {
        this.TrustForm.reset();
        this._route.navigate(['/trust']);
      }

      this.toastr.message(result.message, result.success);
    },(err)=>{
      this.spinner.stop();
      this.toastr.message("Something Went Wrong!!!",false);
        });
  }
  onUpdateTrust() {
    this.spinner.start();

    this._userServ
      .updateTrust(this.TrustForm.value, this.id)
      .subscribe((result) => {
        this.spinner.stop();
        if (result.success) {
          this.TrustForm.reset();
          this._route.navigate(['/trust']);
        }

        this.toastr.message(result.message, result.success);
      },(err)=>{
        this.spinner.stop();
        this.toastr.message("Something Went Wrong!!!",false);
          });
  }
  getdata(id) {
    this.spinner.start();
    this._userServ.getTrust().subscribe((result) => {
      this.spinner.stop();
      console.log(result);

      const data = result.data.users.filter((item, i) => {
        console.log(item);

        if (item._id === id) {
          const { bankAccount, country, specifyOwnershipType } = item;
          this.TrustForm.patchValue({
            trustName: item.trustName,
            description: item.description,
          });
          return bankAccount;
        }
        return null;
      });
      console.log(data);
    },(err)=>{
      this.spinner.stop();
      this.toastr.message("Something Went Wrong!!!",false);
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
