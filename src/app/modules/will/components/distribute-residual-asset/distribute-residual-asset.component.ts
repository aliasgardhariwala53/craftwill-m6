import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MembersService } from 'src/app/services/members.service';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { WillService } from 'src/app/services/will.service';

@Component({
  selector: 'app-distribute-residual-asset',
  templateUrl: './distribute-residual-asset.component.html',
  styleUrls: ['./distribute-residual-asset.component.scss']
})
export class DistributeResidualAssetComponent implements OnInit {
  @Output() onClickNextBtn = new EventEmitter();

  constructor(
    private _fb: FormBuilder,
    private memberServices: MembersService,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService,
    private _willServices: WillService
  ) {
   
  }
  fallbackType: string = 'terminate';
  memberData = [];
  memberDataFallbackReplacement = [];
  slectedResidualMembers = [];
  slectedFallbackMembers = [];
  slectedFallbackReplaceMembers = [];
  toggleModalTutorial:boolean=false;
  distributeResidualAssetsForm: FormGroup;
  key = ['fullname', 'Relationship'];
  classes = ['font-bold', 'font-bold', 'text-sm'];
  totalShareToggle= false;
  totalShareMessage= "";
  createForm() {
    this.distributeResidualAssetsForm = this._fb.group({
      specifyResidualAssetBenificiary:[[],[Validators.required]],

      trustType:['terminate',[Validators.required]],
      //terminate
      fallbackMemberId:[[],[Validators.required]],
      //custom member
      customType:['',[Validators.required]],
      fallbackReplacementMemberId:[[],[Validators.required]],
    });
    this.distributeResidualAssetsForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.distributeResidualAssetsForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
    this.distributeResidualAssetsForm.get("fallbackMemberId")?.valueChanges.subscribe(selectedValue => {
      console.log(selectedValue);
      this.memberDataFallbackReplacement=this.memberData.filter(el => {
        return !selectedValue?.find(element => {
           return element._id === el._id;
        });
     });
      
    })
  }
  formErrors = {
    executorId:'',
    replacementExecutorId:'',
  };

  formErrorMessages = {

    executorId: {
      required: 'Please Select Replacement',
    },
    replacementExecutorId: {
      required: 'Please Select Replacement Executor',
    },
  };
  clickModal(){
    console.log(this.distributeResidualAssetsForm.value.trustType);  
  }

  selectResidualAssetsMember(value) {
    this.distributeResidualAssetsForm.patchValue({
      specifyResidualAssetBenificiary: value,
    });
    console.log(this.distributeResidualAssetsForm.value.specifyResidualAssetBenificiary);

    
  }
  selectFallbackMember(value) {
    console.log(value);

    this.slectedFallbackMembers = value;
    this.distributeResidualAssetsForm.patchValue({
      fallbackMemberId: value,
    });
    console.log(this.distributeResidualAssetsForm.value.fallbackMemberId);
  }
  slecteFallbackReplaceMember(value) {
    console.log(value);

    this.slectedFallbackMembers = value;
    this.distributeResidualAssetsForm.patchValue({
      fallbackReplacementMemberId: value,
    });
    console.log(this.distributeResidualAssetsForm.value.fallbackReplacementMemberId);
  }
  // split
  splitToggle:boolean=false;
  splitHandler(){
    this.splitToggle=!this.splitToggle;
  }
  onClickNext(){
    var totalShare = this.distributeResidualAssetsForm.value.specifyResidualAssetBenificiary?.map((el)=>Number(el.share)).reduce((prev,curr)=>prev+curr,0);

    if(totalShare != 100){
      this.totalShareToggle = true;
      this.totalShareMessage="Total share percentage of selected residual assets beneficiaries must be 100";
      return ;
    }
    var totalShareTrustFallback = this.distributeResidualAssetsForm.value.fallbackMemberId?.map((el)=>Number(el.share)).reduce((prev,curr)=>prev+curr,0);

    if(totalShareTrustFallback != 100 && this.distributeResidualAssetsForm.value.trustType==='terminate'){
      this.totalShareToggle = true;
      this.totalShareMessage="Total share percentage of trust fallback must be 100";
      return ;
    }
    var totalShareTrustFallbackReplacement = this.distributeResidualAssetsForm.value.fallbackReplacementMemberId?.map((el)=>Number(el.share)).reduce((prev,curr)=>prev+curr,0);

    if(totalShareTrustFallbackReplacement != 100 && this.distributeResidualAssetsForm.value.customType==='custom1'){
      this.totalShareToggle = true;
      this.totalShareMessage="Total share percentage of replacement trust beneficiaries must be 100";
      return ;
    }
    this.totalShareToggle = false;
    this.totalShareMessage="";
    this.onClickNextBtn.emit(5)
    const data ={
      specifyResidualAssetBenificiary:this.distributeResidualAssetsForm.value.specifyResidualAssetBenificiary,
      trustFallback :{
        trustType:this.distributeResidualAssetsForm.value.trustType,
        customType:this.distributeResidualAssetsForm.value.customType,
        memberData:this.distributeResidualAssetsForm.value.trustType==='terminate'?this.distributeResidualAssetsForm.value.fallbackMemberId:(this.distributeResidualAssetsForm.value.customType==='custom1'?this.distributeResidualAssetsForm.value.fallbackReplacementMemberId:null)
      }
    }
console.log(data);

    this._willServices.step4.next(data);
  }
  mergeBy_Id(a1, a2) {
    return a1.map((itm) => ({
      ...a2.find((item) => item._id === itm._id && item),
      ...itm,
    }));
  }
  ngOnInit(): void {
    this.createForm();
    this._willServices.step4.subscribe((step4Data) => {
      console.log(step4Data);
      
      this.distributeResidualAssetsForm.patchValue(
        {
          specifyResidualAssetBenificiary:step4Data['specifyResidualAssetBenificiary'] || [],
          trustType:step4Data['trustFallback']?.trustType || 'terminate',
          customType:step4Data['trustFallback']?.customType || '',
          fallbackMemberId:step4Data['trustFallback']?.trustType==='terminate'?step4Data['trustFallback']?.memberData||[]:[],
          fallbackReplacementMemberId:step4Data['trustFallback']?.trustType==='custom'?step4Data['trustFallback']?.memberData || []:[],
        }
      );
      console.log(step4Data);
    });
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
        this.memberDataFallbackReplacement=this.memberData;
        // console.log(this.allMemberData);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message('Error Getting Members data !!', false);
      }
    );
  }

}
