
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
@Component({
  selector: 'app-unsecured-loan',
  templateUrl: './unsecured-loan.component.html',
  styleUrls: ['./unsecured-loan.component.scss']
})
export class UnsecuredLoanComponent implements OnInit {

  UnSecuredLoan:FormGroup
  responseMessage:string
  constructor(private _fb:FormBuilder,private _userServ:UserService,private _route:Router,private toastr: ToastrService) { }

  createForm(){
 this.UnSecuredLoan= this._fb.group({
  loanProvider  : ["",[Validators.required]],
  loan_Number  : ["",[Validators.required]],
  loan_Id_Number  : ["",[Validators.required, Validators.pattern("^[0-9]*$")]],
  current_Outstanding_Amount   : ["",[Validators.required]],
  description   : ["",[Validators.required]],
  
 })
 this.UnSecuredLoan.valueChanges.subscribe(() => {
  this.formErrors = valueChanges(
    this.UnSecuredLoan,
    { ...this.formErrors },
    this.formErrorMessages
  );
});
  }
formErrors = {


  loanProvider: "",
  loan_Number: "",
  loan_Id_Number: "",
  current_Outstanding_Amount: "",
  description: "",



};

formErrorMessages = {

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

  
};

addUnSecuredLoan(){
  console.log(this.UnSecuredLoan);
  
  if (this.UnSecuredLoan.invalid) {
    this.UnSecuredLoan.markAllAsTouched();
    this.formErrors = valueChanges(
      this.UnSecuredLoan,
      { ...this.formErrors },
      this.formErrorMessages
    );
    console.log("invalid");
    return;
  }
  console.log(this.UnSecuredLoan.value);
  const unSecuredLoanData = {
    current_Outstanding_Amount:this.UnSecuredLoan.value.current_Outstanding_Amount,
    unsecuredLoan: this.UnSecuredLoan.value,
    type:'unsecuredLoan'
  };
  this._userServ.addLiabilities(unSecuredLoanData).subscribe((result) => {
    console.log(result);
    if (result.success) {
      this._route.navigate(['/liabilities/liabilitiesSuccess'])
        }
        this.toastr.message(result.message,result.success);
  });

 
}
  ngOnInit(): void {
    this.createForm()
    
  }

}
