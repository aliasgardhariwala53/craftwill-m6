import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { errorHandler, valueChanges } from 'src/app/helper/formerror.helper';
import { MembersService } from 'src/app/services/members.service';
import { TrustService } from 'src/app/services/trust.service';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
@Component({
  selector: 'app-create-trust',
  templateUrl: './create-trust.component.html',
  styleUrls: [
    './create-trust.component.scss',
    '../../../../app.component.scss',
  ],
})
export class CreateTrustComponent implements OnInit {
  assetsId = [];
  assetsData = [];
  trustData = [];
  id: string = '';
  TrustForm: FormGroup;
  responseMessage: string;
  backRouteLink = '/trust';
  forwardRouteLink = '/trust';
  fromCreateWill: string;
  toggleModalTutorial: boolean = false;
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
  memberData = [];
  slectedPrimaryTrustee = [];
  slectedReplacementTrustee = [];
  powerChecked=false;
  trustPowerArray=[];
  // trusteePower: FormArray;
  constructor(
    private _fb: FormBuilder,
    private trustServices: TrustService,
    private spinner: NgxUiLoaderService,
    private _route: Router,
    private toastr: ToastrService,
    private _actRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private memberServices: MembersService
  ) {}
  options=[
    'Hire (and pay from the Trust Fund for) professional help to assist in managing Trust',
    'Find a replacement Trustee',
    'Make any kind of investments',
    'Lease any part of the Trust Fund',
    'Sell or liquidate any part of Trust Fund',
    'Insure any part of Trust Fund',
    'Pay for Trust Beneficiary’s emergency medical expenses',
    'Pay for Trust Beneficiary’s education',
    'Pay for Trust Beneficiary’s insurance',
    'Adjust all payouts for inflation (reference from date of signing)',
    'Withhold / advance payout to Trust Beneficiary',
    'Custom Input'
  ];
  createForm() {
    this.TrustForm = this._fb.group({
      trustName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      _id: [''],
      primary_trustee_type:['sole'],
      replacement_trustee_type:['sole'],
      addTrusteeExecutor:[[]],
      addReplacementTrustee:[[]],
      trusteePower: this._fb.array([])
    });
    this.TrustForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.TrustForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
  }
  formErrors = {
    trustName: '',
    description: '',
  };

  formErrorMessages = {
    trustName: {
      required: 'Trust Name is Required',
    },

    description: {
      required: 'Description is Required',
    },
  };
  onSelectPowers(e){
    console.log();
    this.powerChecked=e.target.checked;
    if (e.target.checked) {
      this.onFilterTrustee();
    } else {
      this.trustPowerArray=[];
    }
    
  }
  onFilterTrustee(){
    this.trustPowerArray=this.TrusteePower.value.filter((el)=>el.isSelected===true);
  }
  addTrustForm() {
    console.log(this.TrustForm);

    if (this.TrustForm.invalid) {
      this.TrustForm.markAllAsTouched();
      this.TrustForm.markAsDirty();
      this.formErrors = valueChanges(
        this.TrustForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
      console.log('invalid');
      return;
    }
    this.spinner.start();
    console.log(this.TrustForm.value);

    this.trustServices.addTrust(this.TrustForm.value).subscribe(
      (result) => {
        this.spinner.stop();
        if (result.success) {
          this.TrustForm.reset();
          if (this.fromCreateWill === 'will') {
            this._route.navigate(['/trust/succesTrust'], {
              queryParams: { y: 'will' },
            });
          } else {
            this._route.navigate(['/trust/succesTrust']);
          }
        }

        this.toastr.message(result.message, result.success);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message(errorHandler(err), false);
      }
    );
  }
  onUpdateTrust() {
    this.spinner.start();

    this.trustServices.updateTrust(this.TrustForm.value, this.id).subscribe(
      (result) => {
        this.spinner.stop();
        if (result.success) {
          this.TrustForm.reset();
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
    this.trustServices.getTrust().subscribe(
      (result) => {
        this.spinner.stop();
        console.log(result);

        const data = result.data.users.filter((item, i) => {
          console.log(item);

          if (item._id === id) {
            const { bankAccount, country, specifyOwnershipType } = item;
            this.TrustForm.patchValue({
              trustName: item.trustName,
              description: item.description,
            });
            return bankAccount;
          }
          return null;
        });
        console.log(data);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message(errorHandler(err), false);
      }
    );
  }
  createItem(value): FormGroup {
    return this._fb.group({
      isSelected:true,
      name: value,
    });
  }

  logArray(){
    if (this.powerChecked) {
      this.onFilterTrustee()
    }
    console.log(this.trustPowerArray);
    
  }
  selectMemberExecutor(value) {
    let primaryTrusteeId: Array<any> = this.TrustForm.value.addTrusteeExecutor;
    if (primaryTrusteeId.includes(value)) {
      primaryTrusteeId.splice(primaryTrusteeId.indexOf(value), 1);
    } else {
      primaryTrusteeId.push(value);
    }
    this.slectedPrimaryTrustee = primaryTrusteeId;
    this.TrustForm.patchValue({
      addTrusteeExecutor: primaryTrusteeId,
    });
  
    // console.log(this.TrustForm.value.addTrusteeExecutor);
  }
  selectMemberReplacementExecutor(value) {
    // console.log(value);

    let replacementTrusteeId: Array<any> =
      this.TrustForm.value.addReplacementTrustee;
    if (replacementTrusteeId.includes(value)) {
      replacementTrusteeId.splice(replacementTrusteeId.indexOf(value), 1);
    } else {
      replacementTrusteeId.push(value);
    }
    this.slectedReplacementTrustee = replacementTrusteeId;
    this.TrustForm.patchValue({
      addReplacementTrustee: replacementTrusteeId,
    });
    // console.log(this.TrustForm.value.replacement_executor_type);
  }

  get TrusteePower(){
    return this.TrustForm.get('trusteePower') as FormArray
  }
  ngOnInit(): void {
    this.createForm();
    this.options.map((el)=>{
      this.TrusteePower.push(this.createItem(el));
    })
    this.route.queryParams.subscribe(({ id, x, y }) => {
      if (id) {
        this.id = id;
        this.getdata(id);
        if (x) {
          this.backRouteLink = '/will/createWill';
        }
      }
      if (y === 'will') {
        this.backRouteLink = '/will/createWill';
        this.forwardRouteLink = '/will/createWill';
        this.fromCreateWill = y;
        console.log(this.fromCreateWill);
      }
    });
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
  }
}
