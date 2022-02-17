import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { errorHandler, valueChanges } from 'src/app/helper/formerror.helper';
import { LiabilitiesService } from 'src/app/services/liabilities.service';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
@Component({
  selector: 'app-unsecured-loan',
  templateUrl: './unsecured-loan.component.html',
  styleUrls: ['./unsecured-loan.component.scss'],
})
export class UnsecuredLoanComponent implements OnInit {
  id: string = '';
  fromCreateWill: string = '';
  UnSecuredLoan: FormGroup;
  responseMessage: string;
  backRouteLink="/liabilities/createLiabilities";
forwardRouteLink="/liabilities";
  toggleModalTutorial: boolean=false;
  constructor(
    private _fb: FormBuilder,
    private liabilitiesServices: LiabilitiesService,
    private spinner: NgxUiLoaderService,
    private _route: Router,
    private toastr: ToastrService,
    private route:ActivatedRoute,
  ) {}

  createForm() {
    this.UnSecuredLoan = this._fb.group({
      loanProvider: ['', [Validators.required]],
      loan_Number: ['', [Validators.required]],
      loan_Id_Number: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      current_Outstanding_Amount: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
    this.UnSecuredLoan.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.UnSecuredLoan,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
  }
  formErrors = {
    loanProvider: '',
    loan_Number: '',
    loan_Id_Number: '',
    current_Outstanding_Amount: '',
    description: '',
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
      pattern: 'Only numeric values allowed',
    },
    description: {
      required: 'Description is Required',
    },
  };

  addUnSecuredLoan() {
    console.log(this.UnSecuredLoan);

    if (this.UnSecuredLoan.invalid) {
      this.UnSecuredLoan.markAllAsTouched();
      this.formErrors = valueChanges(
        this.UnSecuredLoan,
        { ...this.formErrors },
        this.formErrorMessages
      );
      console.log('invalid');
      return;
    }
    this.spinner.start();
    console.log(this.UnSecuredLoan.value);
    const unSecuredLoanData = {
      current_Outstanding_Amount:
        this.UnSecuredLoan.value.current_Outstanding_Amount,
      unsecuredLoan: this.UnSecuredLoan.value,
      type: 'unsecuredLoan',
    };
    this.liabilitiesServices.addLiabilities(unSecuredLoanData).subscribe((result) => {
      this.spinner.stop();
      if (result.success) {
        this.UnSecuredLoan.reset();
         if (this.fromCreateWill==='will') {
            this._route.navigate(['/liabilities/liabilitiesSuccess'],{queryParams:{y:'will'}});
          } else {
            this._route.navigate(['/liabilities/liabilitiesSuccess']);
          }
      }
      this.toastr.message(result.message, result.success);
    },(err)=>{
      this.spinner.stop();
      this.toastr.message(errorHandler(err),false);
        });
  }
  onUpdateUnSecuredLoan(){
    this.spinner.start();
    const unSecuredLoanData = {
      current_Outstanding_Amount:
        this.UnSecuredLoan.value.current_Outstanding_Amount,
      unsecuredLoan: this.UnSecuredLoan.value,
      type: 'unsecuredLoan',
    };
    this.liabilitiesServices.updateLiabilities(unSecuredLoanData,this.id).subscribe((result) => {
      this.spinner.stop();
      if (result.success) {
        this.UnSecuredLoan.reset();
        this._route.navigate([this.forwardRouteLink]);
      }
     
      this.toastr.message(result.message, result.success);
    },(err)=>{
      this.spinner.stop();
      this.toastr.message(errorHandler(err),false);
        });
  }
  getdata(id) {
    this.spinner.start();
    this.liabilitiesServices.getAllLiabilities().subscribe((result) => {
      this.spinner.stop();
      console.log(result);
      
      const data=result.data.filter((item,i)=>{
        if (item._id===id) {
          const {unsecuredLoan,current_Outstanding_Amount} = item;
          this.UnSecuredLoan.patchValue({
            loanName: unsecuredLoan.loanName,
            loanProvider: unsecuredLoan.loanProvider,
            loan_Number: unsecuredLoan.loan_Number,
            loan_Id_Number: unsecuredLoan.loan_Id_Number,
            current_Outstanding_Amount: current_Outstanding_Amount,
            description: unsecuredLoan.description,
            
          })     
          return unsecuredLoan;
        }
        return null;
      })
      console.log(data);
      

     
    },(err)=>{
      this.spinner.stop();
      this.toastr.message(errorHandler(err),false);
        });
  }
  ngOnInit(): void {
    this.createForm();
    this.route.queryParams.subscribe(({id,x,y})=>{
     if (id) {
        this.id = id;
        this.getdata(id);
        if (x) {
    this.backRouteLink="/will/createWill";      
 this.forwardRouteLink="/will/createWill";  
        }
      }
if (y==='will') {
        this.backRouteLink="/will/createWill";   
        this.fromCreateWill = y;
        console.log(this.fromCreateWill);
      }
    })
  }
}
