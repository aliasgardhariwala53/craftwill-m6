import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { errorHandler, valueChanges } from 'src/app/helper/formerror.helper';
import { LiabilitiesService } from 'src/app/services/liabilities.service';
import { MembersService } from 'src/app/services/members.service';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
@Component({
  selector: 'app-private-debt',
  templateUrl: './private-debt.component.html',
  styleUrls: ['./private-debt.component.scss'],
})
export class PrivateDebtComponent implements OnInit {
  memberData = [];
  slectedList = [];
  id: string = '';
  fromCreateWill: string = '';
  toggleModalTutorial: boolean = false;
  nameType = 'fullname' || 'organisationName';
  key = [this.nameType, 'Relationship'];
  classes = ['font-bold', 'font-bold', 'text-sm'];
  backRouteLink="/liabilities/createLiabilities";
forwardRouteLink="/liabilities";
  PrivateDebtForm: FormGroup;
  responseMessage: string;

  constructor(
    private _fb: FormBuilder,
    private liabilitiesServices: LiabilitiesService,
    private memberServices: MembersService,
    private spinner: NgxUiLoaderService,
    private _route: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  createForm() {
    this.PrivateDebtForm = this._fb.group({
      dept_Name: ['', [Validators.required]],
      current_Outstanding_Amount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      description: ['', [Validators.required]],
      memberId: [[], [Validators.required]],
    });
    this.PrivateDebtForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.PrivateDebtForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
  }
  formErrors = {
    dept_Name: '',
    current_Outstanding_Amount: '',
    description: '',
    memberId: '',
  };

  formErrorMessages = {
    dept_Name: {
      required: 'Dept Name is Required',
    },
    current_Outstanding_Amount: {
      required: 'Current Outstanding Amount is Required',
      pattern: 'Only numeric values allowed',
    },
    description: {
      required: 'Description is Required',
    },
    memberId: {
      required: 'Please Select Members',
    },
  };

  selectMember(value) {
    let memberId: Array<any> = this.PrivateDebtForm.value.memberId;
    if (memberId.includes(value)) {
      memberId.splice(memberId.indexOf(value), 1);
    } else {
      memberId.push(value);
    }
    this.slectedList = memberId;
    this.PrivateDebtForm.patchValue({
      memberId: memberId,
    });
    console.log(this.PrivateDebtForm.value.memberId);
  }
  addPrivateDebt() {
    console.log(this.PrivateDebtForm);

    if (this.PrivateDebtForm.invalid) {
      this.PrivateDebtForm.markAllAsTouched();
      this.formErrors = valueChanges(
        this.PrivateDebtForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
      console.log('invalid');

      return;
    }
    this.spinner.start();
    const privateDebtData = {
      current_Outstanding_Amount:
        this.PrivateDebtForm.value.current_Outstanding_Amount,
      privateDept: this.PrivateDebtForm.value,
      type: 'privateDept',
    };
    this.liabilitiesServices.addLiabilities(privateDebtData).subscribe(
      (result) => {
        this.spinner.stop();
        if (result.success) {
          this.PrivateDebtForm.reset();
           if (this.fromCreateWill==='will') {
            this._route.navigate(['/liabilities/liabilitiesSuccess'],{queryParams:{y:'will'}});
          } else {
            this._route.navigate(['/liabilities/liabilitiesSuccess']);
          }
        }

        this.toastr.message(result.message, result.success);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message('Something Went Wrong!!!', false);
      }
    );
  }
  onUpdatePrivateDept() {
    this.spinner.start();
    const privateDeptData = {
      current_Outstanding_Amount:
        this.PrivateDebtForm.value.current_Outstanding_Amount,
      privateDept: this.PrivateDebtForm.value,
      type: 'privateDept',
    };
    this.liabilitiesServices.updateLiabilities(privateDeptData, this.id).subscribe(
      (result) => {
        this.spinner.stop();
        if (result.success) {
          this.PrivateDebtForm.reset();
          this._route.navigate([this.forwardRouteLink]);
        }
        this.toastr.message(result.message, result.success);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message('Something Went Wrong!!!', false);
      }
    );
  }
  getdata(id) {
    this.spinner.start();
    this.liabilitiesServices.getAllLiabilities().subscribe((result) => {
      this.spinner.stop();
      console.log(result);

      const data = result.data.filter((item, i) => {
        if (item._id === id) {
          const { privateDept, current_Outstanding_Amount } = item;
          this.PrivateDebtForm.patchValue({
            dept_Name: privateDept.dept_Name,
            current_Outstanding_Amount: current_Outstanding_Amount,
            description: privateDept.description,
            memberId: privateDept.lender,
          });
          this.slectedList = [...privateDept.lender];
          // this.memberData = result.data.map((item) => {
          //   console.log(item);
          //   return (
          //     { ...item.memberAsPerson, _id: item.lender } || {
          //       ...item.memberAsOrganisation,
          //       _id: item.lender,
          //     }
          //   );
          // });
          return privateDept;
        }
        return null;
      });
      console.log(this.slectedList);
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
if (y==='will') {
        this.backRouteLink="/will/createWill";   
        this.fromCreateWill = y;
        console.log(this.fromCreateWill);
      }
    });
    this.createForm();
    this.memberServices.getMembers().subscribe(
      (result) => {
        // console.log(result.data);
        this.spinner.stop();
        this.memberData = result.data.map((items, i) => {
          console.log(items);

          return {
            fullname: this.memberServices.getMembersData(items).fullname,
            Relationship: this.memberServices.getMembersData(items).Relationship,
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
