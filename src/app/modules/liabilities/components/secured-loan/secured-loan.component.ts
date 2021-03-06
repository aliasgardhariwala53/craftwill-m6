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
  backRouteLink="/liabilities";
  forwardRouteLink="/liabilities";
  id: string='';
  fromCreateWill: string;
  selectedAssetsId=[];
  wid='';
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
      loanName: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'),Validators.maxLength(32)]],
      loanProvider: ['', [Validators.required,Validators.maxLength(16)]],
      // loan_Number: ['', [Validators.required, Validators.pattern('^[0-9]*$'),Validators.maxLength(16)]],
      loan_Id_Number: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$'),Validators.maxLength(16)],
      ],
      current_Outstanding_Amount: ['', [Validators.required, Validators.pattern('^[0-9]*$'),Validators.maxLength(16)]],
      description: ['', [Validators.required,Validators.maxLength(100)]],
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
    // loan_Number: '',
    loan_Id_Number: '',
    current_Outstanding_Amount: '',
    description: '',
    assetId: '',
  };
  formErrorMessages = {
    loanName: {
      required: 'Loan Name is required.',
      maxlength: 'Word limit Exceed..',
      pattern: 'Please enter valid name',
    },
    loanProvider: {
      required: 'Loan Provider is required.',
      maxlength: 'Word limit Exceed..',
    },
    // loan_Number: {
    //   required: 'Loan Number is required.',
    //   pattern: 'Only numeric values allowed',
    //   maxlength: 'Please enter loan valid number',
    // },
    loan_Id_Number: {
      required: 'Loan Id Number is required.',
      maxlength: 'Please enter valid Number',
      pattern: 'Only numeric values allowed',
    },
    current_Outstanding_Amount: {
      required: 'Amount is required.',
      pattern: 'Only numeric values allowed',
      maxlength: 'Please Enter valid Number',
      
    },
    description: {
      required: 'Description is required.',
      maxlength: 'Word limit Exceed..',
    },
    assetId: {
      required: 'Please Select Asset',
    },
  };
  selectAssets(value) {
    //console.log(value);
    
    this.SecuredLoan.patchValue({
      assetId: value.map((el)=>el._id),
    });

    //console.log(this.SecuredLoan.value.assetId);
  }
  addSecuredLoan() {

    //console.log(this.SecuredLoan);

    if (this.SecuredLoan.invalid) {
      this.SecuredLoan.markAllAsTouched();
      this.SecuredLoan.markAsDirty();
      this.formErrors = valueChanges(
        this.SecuredLoan,
        { ...this.formErrors },
        this.formErrorMessages
      );
      //console.log('invalid');
      return;
    }
    this.spinner.start();
    const formvalue = {...this.SecuredLoan.value, assetId: this.SecuredLoan.value.assetId.map(el =>{
      if (el._id) {
        return el?._id
        
      }
      return el;
    } 
    )}
    const securedLoanData = {
    current_Outstanding_Amount:this.SecuredLoan.value.current_Outstanding_Amount,
      securedLoan: formvalue,
      type:'securedLoan'
      
    };
    
    //console.log(securedLoanData);
    this.liabilitiesServices.addLiabilities(securedLoanData).subscribe((result) => {
      this.spinner.stop();
      if (result.success) {
        this.SecuredLoan.reset();
         if (this.fromCreateWill==='will') {
          if (this.wid !== '') {
            this._route.navigate([`${this.forwardRouteLink}`], { queryParams:{y:'will',wid:this.wid}});
            return;
          }
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
    const formvalue = {...this.SecuredLoan.value, assetId: this.SecuredLoan.value.assetId.map(el =>{
      if (el?._id) {
        return el?._id
        
      }else{
        return el;
      }
    } 
    )}
    //console.log(formvalue);
    
    const securedLoanData = {
        current_Outstanding_Amount:this.SecuredLoan.value.current_Outstanding_Amount,
        securedLoan: formvalue,
        type:'securedLoan'
        
      };
    this.liabilitiesServices.updateLiabilities(securedLoanData,this.id).subscribe((result) => {
      this.spinner.stop();
      if (result.success) {
        this.SecuredLoan.reset();
        if (this.wid !== '') {
          this._route.navigate([`${this.forwardRouteLink}`], { queryParams:{wid:this.wid}});
          return;
        }
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
      //console.log(result)
      
      const data=result.data.filter((item,i)=>{
        if (item._id===id) {
          //console.log(item);
          
          const {securedLoan,current_Outstanding_Amount} = item;
          this.SecuredLoan.patchValue({
            loanName: securedLoan?.loanName,
            loanProvider: securedLoan?.loanProvider,
            // loan_Number: securedLoan?.loan_Number,
            loan_Id_Number: securedLoan?.loan_Id_Number,
            current_Outstanding_Amount: current_Outstanding_Amount,
            description: securedLoan?.description,
            assetId: securedLoan?.addAssets?.map((el)=>{
              return { _id:el};
            })
          })     
          this.selectedAssetsId=securedLoan.addAssets.map((el)=>{
            return { _id:el};
          });
          //console.log(this.selectedAssetsId);
          
          return securedLoan;
        }
        return null;
      })
      //console.log(data);  
    },(err)=>{
      this.spinner.stop();
      this.toastr.message(errorHandler(err),false);
        });
  }

  ngOnInit(): void {
    this.spinner.start();
    this.route.queryParams.subscribe(({id,x,y,wid})=>{
     if (id) {
        this.id = id;
        this.getdata(id);
        if (x) {
          this.backRouteLink="/will/createWill";      
 this.forwardRouteLink="/will/createWill";  
        }
        if (y === 'myWill') {
          this.backRouteLink = '/will/myWills';
          this.forwardRouteLink = '/will/myWills';
          this.fromCreateWill = y;
          //console.log(this.fromCreateWill);
        }
        
      }
      if (y === 'will') {
        this.backRouteLink = '/will/createWill';
        this.forwardRouteLink = '/will/createWill';
        this.fromCreateWill = y;
        // //console.log(this.fromCreateWill);
        this.wid=wid
        //console.log(this.wid);
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
      //console.log(this.assetsData);
      
    },(err)=>{
      this.spinner.stop();
        });

  }
}
