import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { MembersService } from 'src/app/services/members.service';
import { WillService } from 'src/app/services/will.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';

@Component({
  selector: 'app-appoint-executor',
  templateUrl: './appoint-executor.component.html',
  styleUrls: ['./appoint-executor.component.scss'],
})
export class AppointExecutorComponent implements OnInit {
  @Output() onClickNextBtn = new EventEmitter();
  constructor(
    private _fb: FormBuilder,
    private memberServices: MembersService,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService,
    private _willServices: WillService
  ) {
  }
  appointExecutorForm: FormGroup;
  memberData = [];
  guardianType = 'guardian1';
  slectedExecutor = [];
  slectedReplacementExecutor = [];
  selectedGuardian = [];
  slectedReplacementGuardian = [];
  selectedItemFromEdit = [];
  deletedItemsInArray = [];
  toggleUpdateModal = false;
  toggleModalTutorial = false;
  editToggle = false;
  listType = [
    {
      id: 1,
      name: 'Sole',
      value: 'sole',
      avatar:
        '/assets/Icons/sole.svg',
    },
    {
      id: 2,
      name: 'Jointly',
      value: 'joint',
      avatar:
        '/assets/Icons/joint.svg',
    },
    {
      id: 3,
      name: 'Jointly & Severally',
      value: 'jointlyAndSeverally',
      avatar:
        '/assets/Icons/joint.svg',
    },
  ];
  // primaryExecutor = this.listType[0].name;
  // replaceExecutor = this.listType[0].name;
  // replaceGuardian = this.listType[0].name;
  // appointGuardian = this.listType[0].name;
  key = ['fullname', 'Relationship'];
  classes = ['font-bold', 'font-bold', 'text-sm'];
  createForm() {
    this.appointExecutorForm = this._fb.group({
       ///Appoint Primary Executor
      primary_executor_type: ['sole', [Validators.required]],
      addPrimaryExecutor: [[]],
    /// Appoint Replacement Executor
      replacement_executor_type: ['sole', [Validators.required]],
      addReplacementExecutor: [[], [Validators.required]],

    /// Appoint Guardian
      guardian_type: ['guardian1', [Validators.required]],

      guardian_executor_type: ['sole'],
      addGuardianExecutor: [[]],
   /// Appoint Replacement Guardian
      guardian_replacement_executor_type: ['sole'],
      addGuardianReplacementExecutor: [[]],

      // executorId: [[], [Validators.required]],
      // replacementExecutorId: [[], [Validators.required]],
      // guardianId: [[], [Validators.required]],
      // replacementGuardianId: [[], [Validators.required]],
    });
    this.appointExecutorForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.appointExecutorForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
  }
  formErrors = {
    executorId: '',
    replacementExecutorId: '',
  };

  formErrorMessages = {
    executorId: {
      required: 'Please Select Replacement',
    },
    replacementExecutorId: {
      required: 'Please Select Replacement Executor',
    },
  };
  selectCircularMembers(value){
    this.deletedItemsInArray=value;
        console.log(value);
        this.appointExecutorForm.patchValue({
          addPrimaryExecutor:value,
        })
        console.log(this.appointExecutorForm.value.addPrimaryExecutor);     
  }
  selectMemberExecutor(value) {
    this.selectedItemFromEdit=value;
    this.deletedItemsInArray=value;
    this.appointExecutorForm.patchValue({
      addPrimaryExecutor: this.selectedItemFromEdit
    });
    console.log(this.appointExecutorForm.value.addPrimaryExecutor);  
       
  }
  selectMemberReplacementExecutor(value) {
    console.log(value);
    this.appointExecutorForm.patchValue({
      addReplacementExecutor: value,
    });
    // console.log(this.appointExecutorForm.value.replacement_executor_type);
  }
  selectMemberGuardian(value) {
    let guardianId: Array<any> = this.appointExecutorForm.value.addGuardianExecutor;
    if (guardianId.includes(value)) {
      guardianId.splice(guardianId.indexOf(value), 1);
    } else {
      guardianId.push(value);
    }
    this.selectedGuardian = guardianId;
    this.appointExecutorForm.patchValue({
      addGuardianExecutor: guardianId,
    });
  }
  selectReplacementMemberGuardian(value) {
    let slectedReplacementGuardian: Array<any> =
      this.appointExecutorForm.value.addGuardianReplacementExecutor;
    if (slectedReplacementGuardian.includes(value)) {
      slectedReplacementGuardian.splice(
        slectedReplacementGuardian.indexOf(value),
        1
      );
    } else {
      slectedReplacementGuardian.push(value);
    }
    this.slectedReplacementGuardian = slectedReplacementGuardian;
    this.appointExecutorForm.patchValue({
      addGuardianReplacementExecutor: slectedReplacementGuardian,
    });
  }
  onClickNext() {
    this.onClickNextBtn.emit(3);
    console.log(this.appointExecutorForm.value);  
    this._willServices.step2.next(this.appointExecutorForm.value);
  }
  onUpdate(value) {}
  ngOnInit(): void {
    this.createForm();
    this.memberServices.getMembers().subscribe(
      (result) => {
        // console.log(result.data);
        this.spinner.stop();
        this.memberData = result.data.map((items, i) => {
          // console.log(items);


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
    this._willServices.step2.subscribe((step2Data) => {
      console.log(step2Data);
      this.appointExecutorForm.setValue(step2Data);
    });
    this.selectedItemFromEdit=this.appointExecutorForm.value.addPrimaryExecutor;

  }
}
