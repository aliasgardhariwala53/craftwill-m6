import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MembersService } from 'src/app/services/members.service';
import { WillService } from 'src/app/services/will.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { valueChanges } from 'src/app/helper/formerror.helper';

@Component({
  selector: 'app-clauses',
  templateUrl: './clauses.component.html',
  styleUrls: ['./clauses.component.scss']
})
export class ClausesComponent implements OnInit {
  @Input() viewClause:string='listClause';
  @Output() onbackClause =new EventEmitter();
  @Output() onClickNextBtn = new EventEmitter();
  toggleModalTutorial:boolean=false;
  showClauseModal:boolean=false;
  clauseType:string='clause1';
  beneficiaryManagedBy:string='delay1';
  translateType:string='';
  memberData = [];
  appointBeneficiaries = [];
  key = ['fullname', 'Relationship'];
  classes = ['font-bold', 'font-bold', 'text-sm'];
  expertiseList=['Investment Advisor','Financial Advisor','Legal Advisor','Tax Advisor','Business Advisor','Others']
  pageTitle:string='Additional Clauses';
  backRouteStep;


  constructor(
    private memberServices: MembersService,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService,
    private _willServices: WillService,
    private _fb: FormBuilder,
  ) {

   }
   allAdvisorArray=[];
   clauseForm: FormGroup;
   advisorForm: FormGroup;
   createForm() {

//advisor group
this.advisorForm =this._fb.group({
  advisorName : ['',[Validators.required,
    Validators.pattern('[a-zA-Z ]*'),
    Validators.maxLength(24),
  ]],
  contactNumber : ['', [Validators.required, Validators.pattern('^[0-9]*$'),Validators.minLength(10), Validators.maxLength(12)]],
  expertise : [,[Validators.required]],
  advisorId:[] 
});
this.advisorForm.valueChanges.subscribe(() => {
  this.formErrors = valueChanges(
    this.advisorForm,
    { ...this.formErrors },
    this.formErrorMessages
  );
});

  }
  formErrors = {
    trustId: '',
    advisorName: '',
    contactNumber: '',
    expertise: '',
  };
  formErrorMessages = {

    advisorName: {
      required: 'Please add advisor Name',
      pattern: 'Advisor Name is Required',
      maxlength: 'Invalid Name',
    },
    contactNumber: {
      required: 'Please add contact number',
      pattern: 'Only numberic value allowed',
      maxlength: 'Invalid Number',
      minlength: 'Min length should be 10',
    },
    expertise: {
      required: 'Please Select Expertise',
      pattern: 'Expertise is Required',
    },
  };
  onSelectClause(){

  }
  selectMemberDelayPayout(value) {
    this.appointBeneficiaries=value;
  }
  onUpdate(value) {}
  setPageInfo(){
    this.onbackClause.emit(this.clauseType);
    switch (this.clauseType) {
      case 'clause1':
        this.pageTitle="Delayed Payout"
        this.viewClause="clause1"
        break;
      case 'clause2':
        this.pageTitle="Recommended Advisor"
        this.viewClause="clause2"
        break;
      case 'clause3':
        this.pageTitle="Final Words"
        this.viewClause="clause3"
        break;
      case 'clause4':
        this.pageTitle="Translation"
        this.viewClause="clause4"
        break;
      case 'clause5':
        this.pageTitle="Custom Clause"
        this.viewClause="clause5"
        break;

    
      default:
        break;
    }
  }
  
  onSaveDelayPayout(){
    this.onbackClause.emit(this.clauseType);
    this.viewClause="listClause"
    // this.clauseType="";
  const data= this.appointBeneficiaries.length ===0 ?null:{
    appointBeneficiaries:this.appointBeneficiaries,
    beneficiaryManagedBy:this.beneficiaryManagedBy,
  }
  console.log(data);
  
    this._willServices.delayPayoutData.next(data);
  }


  onSaveAdvisor(){
    if ( this.advisorForm.invalid) {
      console.log('is 2');
      this.advisorForm.markAllAsTouched();
      this.formErrors = valueChanges(
        this.advisorForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
      return;
    }
    this.onbackClause.emit(this.clauseType);
    this.viewClause="listClause"
    // this.clauseType="";
    console.log(this.advisorForm.value);
    
    this.allAdvisorArray.push(this.advisorForm.value);
    this._willServices.recommendedAdvisorData.next(this.allAdvisorArray);
    this.advisorForm.reset();
  }
  finalWordsForm =new FormControl('')
  onSaveFinalWord(){

    this.onbackClause.emit(this.clauseType);
    this.viewClause="listClause"
    // this.clauseType="";
    console.log(this.finalWordsForm.value);
    this._willServices.finalWordsData.next(this.finalWordsForm.value);
    
  }
  onSaveTranslation(){
    this.onbackClause.emit(this.clauseType);
    this.viewClause="listClause"
    // this.clauseType="";
    this._willServices.translationData.next(this.translateType);
    
  }
  customClauseForm =new FormControl('')
  onSaveCustomClause(){
    this.onbackClause.emit(this.clauseType);
    this.viewClause="listClause"
    // this.clauseType="";
    this._willServices.customClauseData.next(this.customClauseForm.value);
 
  }
  onClickContinue(){
    this.setPageInfo();
    console.log(this.clauseType);
    this.showClauseModal=false;
  }
  onClickNext() {
    this.onClickNextBtn.emit(6);
    const clauses = {
      additionalClauses : {
          delayed_payout : this.appointBeneficiaries.length === 0 ? null : {
              beneficiaryManagedBy : this.beneficiaryManagedBy,
              appointBeneficiaries :this.appointBeneficiaries.map(el =>{
                if (el._id) {
                  return el?._id
                  
                }
                return el;
              } 
              ),
          },
          recommendedAdvisor : this.allAdvisorArray,
          finalWords : this.finalWordsForm.value,
          translation :this.translateType,
          customClause : this.customClauseForm.value ,
 
      }
    }
    this._willServices.step5.next(clauses);
  }
  ngOnInit(): void {
    this.viewClause="listClause";
    
    this.createForm() 

    this.memberServices.getMembers().subscribe(
      (result) => {
        // console.log(result.data);
        this.spinner.stop();
        this.memberData = result.data.map((items, i) => {
          console.log(items);

          return {
            fullname: this.memberServices.getMembersData(items).fullname,
            Relationship:
              this.memberServices.getMembersData(items).Relationship,
            gender: this.memberServices.getMembersData(items).gender,
            id_number: this.memberServices.getMembersData(items).id_number,
            id_type: this.memberServices.getMembersData(items).id_type,
            dob: this.memberServices.getMembersData(items).dob,
            type: items.type,
            _id: items._id,
            actionRoute: 'members/createmembers',
          };
        });
        // console.log(this.allMemberData);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message('Error Getting Members data !!', false);
      }
    );
    this._willServices.delayPayoutData.subscribe((value) => {
      console.log(value);
      
      this.beneficiaryManagedBy=value?.beneficiaryManagedBy || 'delay1';
      console.log( this.beneficiaryManagedBy);
      
      this.appointBeneficiaries=value?.appointBeneficiaries.map((el)=>{
        if (el._id) {
          return el
          
        }
        return {_id:el};
      }) || [];
    });
    this._willServices.recommendedAdvisorData.subscribe((value) => {
      console.log(value);
      this.allAdvisorArray=value;
    });
    this._willServices.finalWordsData.subscribe((value) => {
      console.log(value);
      this.finalWordsForm.patchValue(value);
    });
    this._willServices.translationData.subscribe((value) => {
      console.log(value);
      this.translateType=value;
    });
    this._willServices.customClauseData.subscribe((value) => {
      console.log(value);
      this.customClauseForm.patchValue(value);
    });
    this._willServices.step5.subscribe((value) => {
      console.log(value);
      if(value['additionalClauses']){
        
        const { delayed_payout,recommendedAdvisor,finalWords,translation,customClause} =value['additionalClauses'];
        console.log(delayed_payout,recommendedAdvisor,finalWords,translation,customClause);
        
    this._willServices.delayPayoutData.next(delayed_payout);
    this._willServices.recommendedAdvisorData.next(recommendedAdvisor);
    this._willServices.finalWordsData.next(finalWords);
    this._willServices.translationData.next(translation);
    this._willServices.customClauseData.next(customClause);
        console.log(value);
      }
      return;
    });
  }

}
