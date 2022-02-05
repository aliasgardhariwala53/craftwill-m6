import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
@Component({
  selector: 'app-secured-loan',
  templateUrl: './secured-loan.component.html',
  styleUrls: ['./secured-loan.component.scss'],
})
export class SecuredLoanComponent implements OnInit {
  assetsId = [];
  assetsData = [];

  key = ['nameofAssets', 'uniqueNumber'];
  classes = ['font-bold', 'font-bold', 'text-sm'];
  SecuredLoan: FormGroup;
  responseMessage: string;
  constructor(
    private _fb: FormBuilder,
    private _userServ: UserService,
    private _route: Router,
    private toastr: ToastrService
  ) {}

  createForm() {
    this.SecuredLoan = this._fb.group({
      loanName: ['', [Validators.required]],
      loanProvider: ['', [Validators.required]],
      loan_Number: ['', [Validators.required]],
      loan_Id_Number: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      current_Outstanding_Amount: ['', [Validators.required]],
      description: ['', [Validators.required]],
      assetId: [[], [Validators.required]],
    });
    this.SecuredLoan.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.SecuredLoan,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
  }
  formErrors = {
    loanName: '',
    loanProvider: '',
    loan_Number: '',
    loan_Id_Number: '',
    current_Outstanding_Amount: '',
    description: '',
    assetId: '',
  };
  allAssetsinOne = [];
  formErrorMessages = {
    loanName: {
      required: 'Loan Name is Required',
    },
    loanProvider: {
      required: 'Loan Provider is Required',
    },
    loan_Number: {
      required: 'Loan Number is Required',
    },
    loan_Id_Number: {
      required: 'Loan Id Number is Required',
      pattern: 'Only numeric values allowed',
    },
    current_Outstanding_Amount: {
      required: 'Current Outstanding Amount is Required',
    },
    description: {
      required: 'Description is Required',
    },
    assetId: {
      required: 'Please Select Asset',
    },
  };
  selectAssets(value) {
    let assetId: Array<any> = this.SecuredLoan.value.assetId;
    if (assetId.includes(value)) {
      assetId.splice(assetId.indexOf(value), 1);
    } else {
      assetId.push(value);
    }
    this.SecuredLoan.patchValue({
      assetId: assetId,
    });

    console.log(this.SecuredLoan.value.assetId);
  }
  addSecuredLoan() {
    console.log(this.SecuredLoan);

    if (this.SecuredLoan.invalid) {
      this.SecuredLoan.markAllAsTouched();
      this.SecuredLoan.markAsDirty();
      this.formErrors = valueChanges(
        this.SecuredLoan,
        { ...this.formErrors },
        this.formErrorMessages
      );
      console.log('invalid');
      return;
    }
    const securedLoanData = {
    current_Outstanding_Amount:this.SecuredLoan.value.current_Outstanding_Amount,
      
      securedLoan: this.SecuredLoan.value,
      type:'securedLoan'
      
    };
    console.log(securedLoanData);
    this._userServ.addLiabilities(securedLoanData).subscribe((result) => {
      console.log(result);
      if (result.success) {
        this._route.navigate(['/liabilities/liabilitiesSuccess']);
      }
      this.toastr.message(result.message, result.success);
    });
  }
  ngOnInit(): void {
    this.createForm();
    this._userServ.getAssets().subscribe((result) => {
      this.assetsData = result.data.map((items, i) => {
        this.allAssetsinOne.push(
          ...[
            {
              nameofAssets: Object.keys(items)[0],
              uniqueNumber: Object.values(Object.values(items)[0])[1],
              country: items.country,
              ownerShip: items.specifyOwnershipType,
              _id:items._id
            },
          ]
        );
        console.log(items);
        return items;
      });
    });
  }
}
