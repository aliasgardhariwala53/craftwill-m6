import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { WillService } from 'src/app/services/will.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { ActivatedRoute, Router } from '@angular/router';
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
    ) { }
    id;
  pageTitle='Personal Information';
  viewClause="listClause";
  step=6;
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
    
  }
  onbackClause(value){
  this.viewClause=value;  
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
    this.setPageInfo();
  }
  onEdit(e){
    this.step=e;
    this.setPageInfo()
  }
  ngOnInit(): void {
    this.spinner.start();
    this.route.queryParams.subscribe(({ id, x, y }) => {
      if (id) {
        this.id = id;
 
      }
    });
    this._willServices.getAllWill().subscribe(
      (result) => {
        this.spinner.stop();
        this.willData = result.data.users.filter((el)=>el._id === this.id)[0];
        console.log(this.willData);
        const {  id_Type,
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
  addPrimaryExecutor,
  replacement_executor_type,
  addReplacementExecutor,
  guardian_type,
  guardian_executor_type,
  addGuardianExecutor,
  guardian_replacement_executor_type,
  addGuardianReplacementExecutor,
  liabilities,
assets,
trust,
specifyResidualAssetBenificiary,
residualMemberId,
trustType,
fallbackMemberId,
customType,
fallbackReplacementMemberId,clauses} =this.willData;
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
  addPrimaryExecutor,
  replacement_executor_type,
  addReplacementExecutor,
  guardian_type,
  guardian_executor_type,
  addGuardianExecutor,
  guardian_replacement_executor_type,
  addGuardianReplacementExecutor,

}
console.log(step2);

const step3 ={
  liabilities,
assets,
trust,
}
console.log(step3);

const step4 ={
  specifyResidualAssetBenificiary,
  residualMemberId,
  trustType,
  fallbackMemberId,
  customType,
  fallbackReplacementMemberId,
}
const step5 ={
  ...clauses
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
  }

}
