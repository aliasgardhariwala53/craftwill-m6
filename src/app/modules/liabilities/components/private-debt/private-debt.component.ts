import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
@Component({
  selector: 'app-private-debt',
  templateUrl: './private-debt.component.html',
  styleUrls: ['./private-debt.component.scss'],
})
export class PrivateDebtComponent implements OnInit {
  memberData = [];
  slectedList = [];
  id: string = '';
  toggleModalTutorial: boolean=false;
  nameType = 'fullname' || 'organisationName';
  key = [this.nameType, 'Relationship'];
  classes = ['font-bold', 'font-bold', 'text-sm'];

  PrivateDebtForm: FormGroup;
  responseMessage: string;
  
  constructor(
    private _fb: FormBuilder,
    private _userServ: UserService,
    private spinner: NgxUiLoaderService,
    private _route: Router,
    private toastr: ToastrService,
    private route:ActivatedRoute,
  ) {}

  createForm() {
    this.PrivateDebtForm = this._fb.group({
      dept_Name: ['', [Validators.required]],
      current_Outstanding_Amount: ['', [Validators.required]],
      description: ['', [Validators.required]],
      memberId: [[], [Validators.required]],
    });
    this.PrivateDebtForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.PrivateDebtForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
  }
  formErrors = {
    dept_Name: '',
    current_Outstanding_Amount: '',
    description: '',
    memberId: '',
  };

  formErrorMessages = {
    dept_Name: {
      required: 'Dept Name is Required',
    },
    current_Outstanding_Amount: {
      required: 'Current Outstanding Amount is Required',
    },
    description: {
      required: 'Description is Required',
    },
    memberId: {
      required: 'Please Select Members',
    },
  };

  selectMember(value) {
    let memberId: Array<any> = this.PrivateDebtForm.value.memberId;
    if (memberId.includes(value)) {
      memberId.splice(memberId.indexOf(value), 1);
    } else {
      memberId.push(value);
    }
    this.slectedList=memberId;
    this.PrivateDebtForm.patchValue({
      memberId: memberId,
    });
    console.log(this.PrivateDebtForm.value.memberId);
  }
  addPrivateDebt() {
    console.log(this.PrivateDebtForm);

    if (this.PrivateDebtForm.invalid) {
      this.PrivateDebtForm.markAllAsTouched();
      this.formErrors = valueChanges(
        this.PrivateDebtForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
      console.log('invalid');

      return;
    }
    this.spinner.start();
    const privateDebtData = {
      current_Outstanding_Amount:
        this.PrivateDebtForm.value.current_Outstanding_Amount,
      privateDept: this.PrivateDebtForm.value,
      type: 'privateDept',
    };
    this._userServ.addLiabilities(privateDebtData).subscribe((result) => {
      this.spinner.stop();
      if (result.success) {
        this.PrivateDebtForm.reset();
        this._route.navigate(['/liabilities/liabilitiesSuccess']);
      }

      this.toastr.message(result.message, result.success);
    });
  }
  onUpdatePrivateDept() {
    this.spinner.start();
    const privateDeptData = {
      current_Outstanding_Amount:
        this.PrivateDebtForm.value.current_Outstanding_Amount,
        privateDept: this.PrivateDebtForm.value,
      type: 'privateDept',
    };
    this._userServ
      .updateLiabilities(privateDeptData, this.id)
      .subscribe((result) => {
        this.spinner.stop();
        if (result.success) {
          this.PrivateDebtForm.reset();
          this._route.navigate(['/liabilities']);
        }
        this.toastr.message(result.message, result.success);
      });
  }
    getdata(id) {
    this.spinner.start();
    this._userServ.getAllLiabilities().subscribe((result) => {
      this.spinner.stop();
      console.log(result);

      const data = result.data.filter((item, i) => {
        if (item._id === id) {
          const { privateDept, current_Outstanding_Amount } = item;
          this.PrivateDebtForm.patchValue({
            dept_Name: privateDept.dept_Name,
            current_Outstanding_Amount: current_Outstanding_Amount,
            description:privateDept.description,
            memberId: privateDept.lender,
          });
          this.slectedList=[...privateDept.lender];
          // this.memberData = result.data.map((item) => {
          //   console.log(item);
          //   return (
          //     { ...item.memberAsPerson, _id: item.lender } || {
          //       ...item.memberAsOrganisation,
          //       _id: item.lender,
          //     }
          //   );
          // });
          return privateDept;
        }
        return null;
      });
      console.log(this.slectedList);
    });
  }
  ngOnInit(): void {
    this.spinner.start();
    this.route.queryParams.subscribe(({ id }) => {
      if (id) {
        this.id = id;
        this.getdata(id);
      }
    });
    this.createForm();
    this._userServ.getMembers().subscribe((result) => {
      this.spinner.stop();
      this.memberData = result.data.map((item) => {
        console.log(item);
        return (
          { ...item.memberAsPerson, _id: item._id } || {
            ...item.memberAsOrganisation,
            _id: item._id,
          }
        );
      });
    });
  }
}
