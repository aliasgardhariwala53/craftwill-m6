import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { MembersService } from 'src/app/services/members.service';
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
    private toastr: ToastrService
  ) {}
  appointExecutorForm: FormGroup;
  memberData = [];
  guardianType = 'guardian1';
  slectedExecutor = [];
  slectedReplacementExecutor = [];
  selectedGuardian = [];
  slectedReplacementGuardian = [];
  toggleUpdateModal = false;
  toggleModalTutorial = false;
  listType = [
    {
      id: 1,
      name: 'Sole',
      avatar:
        '/assets/Icons/sole.svg',
    },
    {
      id: 2,
      name: 'Jointly',
      avatar:
        '/assets/Icons/joint.svg',
    },
    {
      id: 3,
      name: 'Jointly & Severally',
      avatar:
        '/assets/Icons/joint.svg',
    },
  ];
  primaryExecutor = this.listType[0].name;
  replaceExecutor = this.listType[0].name;
  replaceGuardian = this.listType[0].name;
  appointGuardian = this.listType[0].name;
  key = ['fullname', 'Relationship'];
  classes = ['font-bold', 'font-bold', 'text-sm'];
  createForm() {
    this.appointExecutorForm = this._fb.group({
      executorId: [[], [Validators.required]],
      replacementExecutorId: [[], [Validators.required]],
      guardianId: [[], [Validators.required]],
      replacementGuardianId: [[], [Validators.required]],
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
  selectMemberExecutor(value) {
    console.log(value);

    let executorId: Array<any> = this.appointExecutorForm.value.executorId;
    if (executorId.includes(value)) {
      executorId.splice(executorId.indexOf(value), 1);
    } else {
      executorId.push(value);
    }
    this.slectedExecutor = executorId;
    this.appointExecutorForm.patchValue({
      executorId: executorId,
    });
    console.log(this.appointExecutorForm.value.executorId);
  }
  selectMemberReplacementExecutor(value) {
    console.log(value);

    let replacementExecutorId: Array<any> =
      this.appointExecutorForm.value.replacementExecutorId;
    if (replacementExecutorId.includes(value)) {
      replacementExecutorId.splice(replacementExecutorId.indexOf(value), 1);
    } else {
      replacementExecutorId.push(value);
    }
    this.slectedReplacementExecutor = replacementExecutorId;
    this.appointExecutorForm.patchValue({
      replacementExecutorId: replacementExecutorId,
    });
    console.log(this.appointExecutorForm.value.replacementExecutorId);
  }
  selectMemberGuardian(value) {
    let guardianId: Array<any> = this.appointExecutorForm.value.guardianId;
    if (guardianId.includes(value)) {
      guardianId.splice(guardianId.indexOf(value), 1);
    } else {
      guardianId.push(value);
    }
    this.selectedGuardian = guardianId;
    this.appointExecutorForm.patchValue({
      guardianId: guardianId,
    });
  }
  selectReplacementMemberGuardian(value) {
    let slectedReplacementGuardian: Array<any> =
      this.appointExecutorForm.value.replacementGuardianId;
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
      replacementGuardianId: slectedReplacementGuardian,
    });
  }
  onClickNext() {
    this.onClickNextBtn.emit(3);
  }
  onUpdate(value) {}
  ngOnInit(): void {
    this.createForm();
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
