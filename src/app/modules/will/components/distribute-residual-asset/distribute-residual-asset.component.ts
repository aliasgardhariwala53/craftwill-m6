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
  slectedResidualMembers = [];
  slectedFallbackMembers = [];
  slectedFallbackReplaceMembers = [];
  toggleModalTutorial:boolean=false;
  distributeResidualAssetsForm: FormGroup;
  key = ['fullname', 'Relationship'];
  classes = ['font-bold', 'font-bold', 'text-sm'];
  createForm() {
    this.distributeResidualAssetsForm = this._fb.group({
      specifyResidualAssetBenificiary:[[]],
      residualMemberId:[[],[Validators.required]],

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
    console.log(value);
    let residualMemberId: Array<any> = this.distributeResidualAssetsForm.value.residualMemberId;
    if (residualMemberId.includes(value)) {
      residualMemberId.splice(residualMemberId.indexOf(value), 1);
    } else {
      residualMemberId.push(value);
    }
    this.slectedResidualMembers = residualMemberId;
    this.distributeResidualAssetsForm.patchValue({
      residualMemberId: residualMemberId,
    });
    console.log(this.distributeResidualAssetsForm.value.residualMemberId);

    
  }
  selectFallbackMember(value) {
    console.log(value);
    
    let fallbackMemberId: Array<any> = this.distributeResidualAssetsForm.value.fallbackMemberId;
    if (fallbackMemberId.includes(value)) {
      fallbackMemberId.splice(fallbackMemberId.indexOf(value), 1);
    } else {
      fallbackMemberId.push(value);
    }
    this.slectedFallbackMembers = fallbackMemberId;
    this.distributeResidualAssetsForm.patchValue({
      fallbackMemberId: fallbackMemberId,
    });
    console.log(this.distributeResidualAssetsForm.value.fallbackMemberId);
  }
  slecteFallbackReplaceMember(value) {
    console.log(value);
    
    let fallbackReplaceMemberId: Array<any> = this.distributeResidualAssetsForm.value.fallbackReplacementMemberId;
    if (fallbackReplaceMemberId.includes(value)) {
      fallbackReplaceMemberId.splice(fallbackReplaceMemberId.indexOf(value), 1);
    } else {
      fallbackReplaceMemberId.push(value);
    }
    this.slectedFallbackMembers = fallbackReplaceMemberId;
    this.distributeResidualAssetsForm.patchValue({
      fallbackReplacementMemberId: fallbackReplaceMemberId,
    });
    console.log(this.distributeResidualAssetsForm.value.fallbackReplacementMemberId);
  }
  // split
  splitToggle:boolean=false;
  splitHandler(){
    this.splitToggle=!this.splitToggle;
  }
  onClickNext(){
    this.onClickNextBtn.emit(5)
    this._willServices.step4.next(this.distributeResidualAssetsForm.value);
  }
  ngOnInit(): void {
    this.createForm();
    this._willServices.step4.subscribe((step4Data) => {
      console.log(step4Data);
      this.distributeResidualAssetsForm.setValue(step4Data);
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
        // console.log(this.allMemberData);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message('Error Getting Members data !!', false);
      }
    );
  }

}
