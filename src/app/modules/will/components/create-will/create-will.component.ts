import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { WillService } from 'src/app/services/will.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MembersService } from 'src/app/services/members.service';
@Component({
  selector: 'app-create-will',
  templateUrl: './create-will.component.html',
  styleUrls: ['./create-will.component.scss', '../../../../app.component.scss']
})
export class CreateWillComponent implements OnInit {
  willData;
  constructor(
     private _fb: FormBuilder,
     private _willServices: WillService,
     private toastr: ToastrService,
     private spinner: NgxUiLoaderService,
     private route: ActivatedRoute,
     private _route: Router,
     private memberServices: MembersService,
    ) { }
    wid;
    globalReload;
  pageTitle='Personal Information';
  viewClause="listClause";
  step=1;
  memberData=[];
  step3Data={};
  setPageInfo(){
    switch (this.step) {
      case 1:
        this.pageTitle="Personal Information"
        break;
      case 2:
        this.pageTitle="Appoint Executor"
        break;
      case 3:
        this.pageTitle="Distribution Of Assets"
        break;
      case 4:
        this.pageTitle="Distribute Residual Asset"
        break;
      case 5:
        this.pageTitle="Clauses"
        break;
      case 6:
        this.pageTitle="Review"
        break;
    
      default:
        break;
    }
  }
  next(value) {
    this.step+=1;
    this.setPageInfo()
    console.log(value);
    this._willServices.currentStep.next(this.step);
  }
  onbackClause(value){
  this.viewClause=value;  
  }
  
  idMapperToObj(arr){
    return arr.map((el)=>({
      _id:el
    }));
}
mergeBy_Id(a1, a2) {
  return a1.map((itm) => ({
    ...a2.find((item) => item._id === itm._id && item),
    ...itm,
  }));
}
  back(){
    if (this.step<=1) {
      this._route.navigate([`will/myWills`])
      return;
    }
    if (this.step===5 && this.viewClause!=='listClause') {
      this.viewClause='listClause';
      return;
    }
    this.step=this.step-1;
    this._willServices.currentStep.next(this.step);
    this.setPageInfo();
  }
  onEdit(e){
    this.step=e;
    this.setPageInfo()
    this._willServices.currentStep.next(this.step);
  }
  ngOnInit(): void {
    
    this.route.queryParams.subscribe(({ wid, x, y }) => {
      if (wid) {
        this.wid = wid;
 
      }
    });
    this._willServices.currentStep.subscribe((value) => {
      this.step=value;
    this.setPageInfo()
    });
  if(this._willServices.globalReload.getValue() && this.wid ){
    this.spinner.start();
    this._willServices.getAllWill().subscribe(
      (result) => {
        this.spinner.stop();
        console.log("result",result);
        
        this.willData = result.data.users.filter((el)=>el._id === this.wid)[0];
        const {  id_Type='',
          id_Number,
          gender,
          fullName,
          email,
          floorNumber,
          unitNumber,
          streetName,
          postalCode,
          assetScope,
          primary_executor_type,
  primaryExecutors,
  replacement_executor_type,
  replacementExecutors,
  guardian_type,
  guardian_executor_type,
  guardianExecutor,
  guardian_replacement_executor_type,
  guardianReplacementExecutor,
  liabilitiesData,
assets,
trust,
specifyResidualAssetBenificiary,
trustFallback,clauses} =this.willData;
console.log(assets);

const step1 ={
  id_Type,
  id_Number,
  gender,
  fullName,
  email,
  floorNumber,
  unitNumber,
  streetName,
  postalCode,
  assetScope,
}
const step2 ={
  primary_executor_type,
  primaryExecutors:this.idMapperToObj(primaryExecutors),
  replacement_executor_type,
  replacementExecutors:this.idMapperToObj(replacementExecutors),
  guardian_type,
  guardian_executor_type,
  guardianExecutor:this.idMapperToObj(guardianExecutor),
  guardian_replacement_executor_type,
  guardianReplacementExecutor:this.idMapperToObj(guardianReplacementExecutor),

}
console.log(step2);

const step3 ={
  liabilitiesData:this.idMapperToObj(liabilitiesData),
assets,
trust:trust.map((el)=>({_id:el.trustData})),
}
this._willServices.allTrustAdditionalData.next(trust);
const payout =trust.map((el)=>el.payouts)
console.log(payout.flat());
this._willServices.allpayoutTrust.next(payout.flat());
console.log(step3);
this.step3Data =step3;
const step4 ={
  specifyResidualAssetBenificiary:specifyResidualAssetBenificiary.map((el)=>({_id:el?.member,share:el?.specifyShares})),
  trustFallback,
}
const step5 ={
  ...clauses
}
console.log(step4);

const newStep3 =step3['assets']?.map((el)=>({_id:el?.assetData})) || null;
this._willServices.step3AssetData.next(newStep3);


// sttep3 assets meber function
    let assetsBeneficiary = []
const getData =this.step3Data['assets'].map((item)=>{
      console.log(this.memberData);
      
      return {...item.membersData.map((el)=>{
        const temp = {
          assetId:item.assetData,
          _id:el.member,
          share:el.specify_Shares,
        }
        assetsBeneficiary.push(temp)
        return temp;
      })}
});
    console.log(assetsBeneficiary);
if (this._willServices.assetsBeneficiary.getValue().length==0) {
   this._willServices.assetsBeneficiary.next(assetsBeneficiary);
}
        this._willServices.step1.next(step1);
        this._willServices.step2.next(step2);
        this._willServices.step3.next(step3);
        this._willServices.step4.next(step4);
        this._willServices.step5.next(step5);

      },
      (err) => {
        this.spinner.stop();
      }
    );
    this._willServices.globalReload.next(false);
  }

  }

}
