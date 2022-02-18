import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { errorHandler, valueChanges } from 'src/app/helper/formerror.helper';
import { AssetsService } from 'src/app/services/assets.service';
import { LiabilitiesService } from 'src/app/services/liabilities.service';
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
  backRouteLink="/liabilities/createLiabilities";
forwardRouteLink="/liabilities";
  id: string='';
  fromCreateWill: string;
  selectedAssetsId;
  toggleModalTutorial: boolean=false;
  constructor(
    private _fb: FormBuilder,
    private liabilitiesServices: LiabilitiesService,
    private assetsServices: AssetsService,
    private _route: Router,
    private toastr: ToastrService,
    private spinner:NgxUiLoaderService,
    private route:ActivatedRoute,
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
      current_Outstanding_Amount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
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
      pattern: 'Only numeric values allowed',
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
    }
    else {
      assetId?.push(value);
    }
    this.selectedAssetsId=assetId;
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
    this.spinner.start();
    const securedLoanData = {
    current_Outstanding_Amount:this.SecuredLoan.value.current_Outstanding_Amount,
      securedLoan: this.SecuredLoan.value,
      type:'securedLoan'
      
    };
    
    console.log(securedLoanData);
    this.liabilitiesServices.addLiabilities(securedLoanData).subscribe((result) => {
      this.spinner.stop();
      if (result.success) {
        this.SecuredLoan.reset();
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
  onUpdateSecuredLoan(){
    this.spinner.start();
    const securedLoanData = {
      current_Outstanding_Amount:this.SecuredLoan.value.current_Outstanding_Amount,
        securedLoan: this.SecuredLoan.value,
        type:'securedLoan'
        
      };
    this.liabilitiesServices.updateLiabilities(securedLoanData,this.id).subscribe((result) => {
      this.spinner.stop();
      if (result.success) {
        this.SecuredLoan.reset();
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
          const {securedLoan,current_Outstanding_Amount} = item;
          this.SecuredLoan.patchValue({
            loanName: securedLoan.loanName,
            loanProvider: securedLoan.loanProvider,
            loan_Number: securedLoan.loan_Number,
            loan_Id_Number: securedLoan.loan_Id_Number,
            current_Outstanding_Amount: current_Outstanding_Amount,
            description: securedLoan.description,
            // assetId: securedLoan.assetId,
          })     
          this.selectedAssetsId=securedLoan.addAssets;
          return securedLoan;
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
    this.spinner.start();
    this.route.queryParams.subscribe(({id,x,y})=>{
     if (id) {
        this.id = id;
        this.getdata(id);
        if (x) {
          this.backRouteLink="/will/createWill";      
 this.forwardRouteLink="/will/createWill";  
        }
      }
    })
    this.createForm();
    this.assetsServices.getAssets().subscribe((result) => {
      this.spinner.stop();
      this.assetsData = result.data.map((items, i) => {
        return {
          nameofAssets: this.assetsServices.getAssetsData(items)?.name,
          uniqueNumber: this.assetsServices.getAssetsData(items)?.uniqueNumber,
          country: items.country,
          ownerShip: items.specifyOwnershipType,
          type: items.type,
          _id: items._id,
          actionRoute: this.assetsServices.getAssetsData(items)?.actionRoute,
          image:this.assetsServices.getAssetsData(items)?.img,
        };
      });
    },(err)=>{
      this.spinner.stop();
        });

  }
}
