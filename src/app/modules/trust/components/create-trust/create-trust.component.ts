import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { errorHandler, valueChanges } from 'src/app/helper/formerror.helper';
import { MembersService } from 'src/app/services/members.service';
import { TrustService } from 'src/app/services/trust.service';
import { UserService } from 'src/app/services/user.service';
import { WillService } from 'src/app/services/will.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
@Component({
  selector: 'app-create-trust',
  templateUrl: './create-trust.component.html',
  styleUrls: [
    './create-trust.component.scss',
    '../../../../app.component.scss',
  ],
})
export class CreateTrustComponent implements OnInit,OnChanges {
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
  payoutToggle: boolean = false;
  editToggle: boolean = false;

  allpayoutTrust=[];
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

  keyOfPayoutMember = ['fullname', 'Relationship'];
  classesOfPayoutMember = ['font-bold', 'font-bold', 'text-sm'];

  memberData = [];
  slectedPrimaryTrustee = [];
  slectedReplacementTrustee = [];
  powerChecked = false;
  trustPowerArray = [];
  currentPayoutObj;
  deletedMemberTrustfallback=[];
  selectedItemFromEdit = [];
  keyPayout =[
    {
    name:'Payouts',
    value:'payoutNo',
  },
    {
    name:'Source Of Payout',
    value:'sourceOfPayout',
  },
    {
    name:'Denomination Of Payout',
    value:'denominationOfPayout',
  },
    {
    name:'Frequency Of Payout',
    value:'frequencyOfPayout',
  },
    {
    name:'Conditions Of Payout',
    value:'conditionsOfPayout',
  },
    {
    name:'Purpose Of Payout',
    value:'purposeOfPayout',
  },

]
  classesPayout = ['bg-[#EAEAEA]', 'bg-[#fff] p-3 rounded-2xl', 'bg-[#EAEAEA]','bg-[#EAEAEA]', 'bg-[#fff] p-3 rounded-2xl', 'bg-[#fff] p-3 rounded-2xl'];
  payoutList = [];
  trustAdditionalData={};
  allTrustAdditionalData=[];
  constructor(
    private _fb: FormBuilder,
    private trustServices: TrustService,
    private spinner: NgxUiLoaderService,
    private _route: Router,
    private toastr: ToastrService,
    private _actRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private memberServices: MembersService,
    private _willServices: WillService
  ) {}
  options = [
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
    '',
  ];
  createForm() {
    this.TrustForm = this._fb.group({
      trustName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      _id: [''],
      primaryTrusteeMember: [[]],
      primaryTrusteeOwnership: ['Sole'],

      repelacementTrusteeMember : [[]],
      repelacementTrusteeOwnership :['Sole'],
      trusteePower: this._fb.array([]),

      memberDataTrustfallback:[],
      fallBackType:['terminate'],
      descriptionFallback:[''],
      additionalClauses:[],
    });
    this.TrustForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.TrustForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
    this.TrusteePower.valueChanges.subscribe(() => {
      this.onClickIndividualCheckBox();
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
  onSelectPowers(e) {
    console.log();
    this.powerChecked = e.target.checked;
    if (e.target.checked) {
      this.onFilterTrustee();
    } else {
      this.trustPowerArray = [];
    }
  }
  onFilterTrustee() {
    this.trustPowerArray = this.TrusteePower.value.filter(
      (el) => el.isSelected === true
    );
  }
    // split
    splitToggle:boolean=false;
    splitHandler(){
      this.splitToggle=!this.splitToggle;
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
  getRemainingMembers(value){
    this.deletedMemberTrustfallback=value;
        console.log(value);
        this.TrustForm.patchValue({
          memberDataTrustfallback:value,
        })
   
  }
  selectMembertrustee(value) {
    this.selectedItemFromEdit=value;
    this.deletedMemberTrustfallback=value;
    this.TrustForm.patchValue({
      memberDataTrustfallback: this.selectedItemFromEdit
    });
;  
       
  }
  onUpdateTrust() {
    this.spinner.start();

    this.trustServices.updateTrust(this.TrustForm.value, this.id).subscribe(
      (result) => {
        this.spinner.stop();
        if (result.success) {
          this.allpayoutTrust = this.allpayoutTrust.filter((el) => el._id!== this.id);
          this.allpayoutTrust=[...this.allpayoutTrust,...this.payoutList]
          this._willServices.allpayoutTrust.next(this.allpayoutTrust);
          const trust = {
            trustData: this.id,
            addTrust: {
              appointPrimaryTrustee: {
                specifyOwnershipType: this.TrustForm.value.primaryTrusteeOwnership,
                trustMembers: this.TrustForm.value.primaryTrusteeMember,
              },
              appointReplacementTrustee: {
                specifyOwnershipType: this.TrustForm.value.repelacementTrusteeOwnership,
                trustMembers: this.TrustForm.value.repelacementTrusteeMember,
              },
              specifyTrusteePowers: this.trustPowerArray.map((el) => el.name),
            },
            assets:{},
            payouts:this.payoutList,
            trustFallback :{
              memberData:this.TrustForm.value.fallBackType==='terminate'?this.TrustForm.value.memberDataTrustfallback:null,
              fallBackType :this.TrustForm.value.fallBackType,
              description :this.TrustForm.value.fallBackType==='custom'?this.TrustForm.value.descriptionFallback:null,
            },
            additionalClauses :this.TrustForm.value.additionalClauses,

          };
          this.trustAdditionalData={...trust}
          console.log('trust', this.trustAdditionalData);
          this.allTrustAdditionalData=this.allTrustAdditionalData.filter((el)=>el.trustData!==this.id);
          this.allTrustAdditionalData=[...this.allTrustAdditionalData,this.trustAdditionalData];
          console.log('trust', this.allTrustAdditionalData);
          this._willServices.allTrustAdditionalData.next(this.allTrustAdditionalData);
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
      isSelected: true,
      name: value,
    });
  }

  onClickIndividualCheckBox() {
    if (this.powerChecked) {
      this.onFilterTrustee();
    }
    console.log(this.trustPowerArray);
  }

  selectMemberTrustee(value) {
    this.TrustForm.patchValue({
      primaryTrusteeMember:value,
    });
  }


  selectMemberReplacementTrustee(value) {
    console.log('selectMemberReplacementTrustee', value);
    this.TrustForm.patchValue({
      repelacementTrusteeMember:value,
    });
  }
  onSavePayout(value){
    this.currentPayoutObj={
      _id:this.id,
      ...value,
    }
    this.payoutList.push(this.currentPayoutObj);
    this.payoutList=this.payoutList.map((el,i)=>{
      return {...el,payoutNo:`Payouts ${i+1}`}
    });
 console.log(this.payoutList);
 
  }
  get TrusteePower() {
    return this.TrustForm.get('trusteePower') as FormArray;
  }
  ngOnChanges(changes: SimpleChanges): void {
    
  }
  ngOnInit(): void {
    this.createForm();
    
    
    this._willServices.allpayoutTrust.subscribe((value) => {
      this.allpayoutTrust=value;
      this.payoutList = value.filter((el) => el._id === this.id);
      console.log(value);
    });
    this.options.map((el) => {
      this.TrusteePower.push(this.createItem(el));
    });
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
      if (y === 'myWill') {
        this.backRouteLink = '/will/myWills';
        this.forwardRouteLink = '/will/myWills';
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
    
    this._willServices.allTrustAdditionalData.subscribe((value) => {
      this.allTrustAdditionalData=value;
      this.trustAdditionalData = (value.filter((el) => el.trustData === this.id))[0];
      const data = (value.filter((el) => el.trustData === this.id))[0];
      console.log(this.trustAdditionalData);
      this.TrustForm.patchValue({
        primaryTrusteeOwnership:data.addTrust.appointPrimaryTrustee.specifyOwnershipType,
        primaryTrusteeMember: data.addTrust.appointPrimaryTrustee.trustMembers,
        repelacementTrusteeOwnership :data.addTrust.appointReplacementTrustee.specifyOwnershipType,
        repelacementTrusteeMember: data.addTrust.appointReplacementTrustee.trustMembers,
        trusteePower: data.addTrust.specifyTrusteePowers,
  
        memberDataTrustfallback:data.trustFallback.memberData,
        fallBackType:data.trustFallback.fallBackType,
        descriptionFallback:data.trustFallback.description,
        additionalClauses:data.additionalClauses,
      })
      this.selectedItemFromEdit=data.trustFallback.memberData;
      this.payoutList=data.payouts;
      console.log(this.TrustForm.value);
    });
  }
}
