import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
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
  ) {}
  appointExecutorForm: FormGroup;
  memberData = [];
  memberDataExecutor = [];
  memberDataGuardianExecutor = [];
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

  memberDataEditBox = [];
  listType = [
    {
      id: 1,
      name: 'Sole',
      value: 'sole',
      avatar: '/assets/Icons/sole.svg',
    },
    {
      id: 2,
      name: 'Jointly',
      value: 'joint',
      avatar: '/assets/Icons/joint.svg',
    },
    {
      id: 3,
      name: 'Jointly & Severally',
      value: 'jointlyAndSeverally',
      avatar: '/assets/Icons/joint.svg',
    },
  ];
  key = ['fullname', 'Relationship'];
  classes = ['font-bold', 'font-bold', 'text-sm'];
  createForm() {
    this.appointExecutorForm = this._fb.group({
      ///Appoint Primary Executor
      primary_executor_type: ['sole', [Validators.required]],
      primaryExecutors: [[]],
      /// Appoint Replacement Executor
      replacement_executor_type: ['sole', [Validators.required]],
      replacementExecutors: [[], [Validators.required]],

      /// Appoint Guardian
      guardian_type: ['guardian1', [Validators.required]],

      guardian_executor_type: ['sole'],
      guardianExecutor: [[]],
      /// Appoint Replacement Guardian
      guardian_replacement_executor_type: ['sole'],
      guardianReplacementExecutor: [[]],
    });
    this.appointExecutorForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.appointExecutorForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
    this.appointExecutorForm
      .get('primary_executor_type')
      .valueChanges.subscribe((selectedValue) => {
        //console.log(selectedValue);
        if (selectedValue === 'sole') {
          this.selectedItemFromEdit =
            this.appointExecutorForm.value.primaryExecutors.slice(0, 1);
          this.deletedItemsInArray =
            this.appointExecutorForm.value.primaryExecutors.slice(0, 1);
          this.appointExecutorForm.patchValue({
            primaryExecutors:
              this.appointExecutorForm.value.primaryExecutors.slice(0, 1),
          });
        }
      });
    this.appointExecutorForm
      .get('replacement_executor_type')
      .valueChanges.subscribe((selectedValue) => {
        //console.log(selectedValue);
        if (selectedValue === 'sole') {
          this.appointExecutorForm.patchValue({
            replacementExecutors:
              this.appointExecutorForm.value.replacementExecutors.slice(0, 1),
          });
        }
      });
    this.appointExecutorForm
      .get('guardian_executor_type')
      .valueChanges.subscribe((selectedValue) => {
        //console.log(selectedValue);
        if (selectedValue === 'sole') {
          this.appointExecutorForm.patchValue({
            guardianExecutor:
              this.appointExecutorForm.value.guardianExecutor.slice(0, 1),
          });
        }
      });
    this.appointExecutorForm
      .get('guardian_replacement_executor_type')
      .valueChanges.subscribe((selectedValue) => {
        //console.log(selectedValue);
        if (selectedValue === 'sole') {
          this.appointExecutorForm.patchValue({
            guardianReplacementExecutor:
              this.appointExecutorForm.value.guardianReplacementExecutor.slice(
                0,
                1
              ),
          });
        }
      });
    this.appointExecutorForm
      .get('primaryExecutors')
      .valueChanges.subscribe((selectedValue) => {
        //console.log(selectedValue);
        this.memberDataExecutor = this.memberData.filter((el) => {
          return !selectedValue?.find((element) => {
            return element._id === el._id;
          });
        });
      });
    this.appointExecutorForm
      .get('guardianExecutor')
      .valueChanges.subscribe((selectedValue) => {
        //console.log(selectedValue);
        this.memberDataGuardianExecutor = this.memberData.filter((el) => {
          return !selectedValue?.find((element) => {
            return element._id === el._id;
          });
        });
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
  selectCircularMembers(value) {
    this.deletedItemsInArray = value;
    //console.log(value);
    this.appointExecutorForm.patchValue({
      primaryExecutors: value,
    });
    //console.log(this.appointExecutorForm.value.primaryExecutors);
  }
  selectMemberExecutor(value) {
    this.selectedItemFromEdit = value;
    this.deletedItemsInArray = value;
    this.appointExecutorForm.patchValue({
      primaryExecutors: this.selectedItemFromEdit,
    });
    //console.log(this.appointExecutorForm.value.primaryExecutors);
  }
  selectMemberReplacementExecutor(value) {
    //console.log(value);
    this.appointExecutorForm.patchValue({
      replacementExecutors: value,
    });
    // //console.log(this.appointExecutorForm.value.replacement_executor_type);
  }
  selectMemberGuardian(value) {
    // let guardianId: Array<any> = this.appointExecutorForm.value.guardianExecutor;
    // if (guardianId.includes(value)) {
    //   guardianId.splice(guardianId.indexOf(value), 1);
    // } else {
    //   guardianId.push(value);
    // }
    // this.selectedGuardian = guardianId;
    this.appointExecutorForm.patchValue({
      guardianExecutor: value,
    });
  }
  mergeById(a1, a2) {
    //console.log(a1, 'a1', a2, 'a2');

    return a1?.map((itm) => ({
      ...a2?.find((item) => item?._id === itm?._id && item),
      ...itm,
    }));
  }
  filterById(a1, a2) {
    //console.log(a1, 'a1', a2, 'a2');
    return a1?.filter((el) => {
      return !a2?.includes((el2) => el2._id === el._id);
    });
  }
  selectReplacementMemberGuardian(value) {
    this.appointExecutorForm.patchValue({
      guardianReplacementExecutor: value,
    });
  }
  onClickNext() {
    this.onClickNextBtn.emit(3);
    //console.log(this.appointExecutorForm.value);
    this._willServices.step2.next(this.appointExecutorForm.value);
  }
  onUpdate(value) {}
  getAge(value) {
    const data = moment().diff(moment(value, 'YYYY-MM-DD'), 'years');
    //console.log(data);
    return data;
  }
  ngOnInit(): void {
    this.createForm();
    this.spinner.start();
    this.memberServices.getMembers().subscribe(
      (result) => {
        this.spinner.stop();
        // //console.log(result.data);

        this.memberData = result.data
          .map((items, i) => {
            // //console.log(items);

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
          })
          ?.filter((el) => {
            //console.log(el.dob);
            //console.log(this.getAge(el.dob));
            return this.getAge(el.dob) > 20;
          });
        //console.log(this.memberData);

        this.memberData = this.memberData;
        //console.log(this.memberData);

        this.memberDataExecutor = this.memberData;
        this.memberDataGuardianExecutor = this.memberData;
        // //console.log(this.allMemberData);
        this._willServices.step2.subscribe((step2Data) => {
          //console.log(step2Data['primaryExecutors']);
          this.appointExecutorForm.patchValue(step2Data);
          this.selectedItemFromEdit = step2Data['primaryExecutors'];
          this.memberDataEditBox = this.filterById(
            this.memberData,
            step2Data['primaryExecutors']
          );
          this.selectedItemFromEdit = this.mergeById(
            step2Data['primaryExecutors'],
            this.memberData
          );
          //console.log(this.selectedItemFromEdit);
        });
        this.memberDataEditBox = this.filterById(
          this.memberData,
          this.appointExecutorForm.value.primaryExecutors
        );
        this.selectedItemFromEdit = this.mergeById(
          this.appointExecutorForm.value.primaryExecutors,
          this.memberData
        );
        this.deletedItemsInArray = this.selectedItemFromEdit;
        //console.log(this.deletedItemsInArray);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message('Error Getting Members data !!', false);
      }
    );
    this.getAge('08-10-1996');
  }
}
