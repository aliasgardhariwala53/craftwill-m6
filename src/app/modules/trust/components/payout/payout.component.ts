import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WillService } from 'src/app/services/will.service';
import { MembersService } from 'src/app/services/members.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-payout',
  templateUrl: './payout.component.html',
  styleUrls: ['./payout.component.scss'],
})
export class PayoutComponent implements OnInit {
  @Input() payoutListOfoneTrust=[];
  @Output() onClickback =new EventEmitter(); 
  @Output() onSaveData =new EventEmitter(); 
  toggleModalTutorial: boolean = false;
  fallbackChecked: boolean = false;
  addPayoutToggle = '';
  trustFallback = [];
  allPayoutArray = [];
  payoutForm: FormGroup;
  memberData = [];
  editToggle = false;
  selectedItemFromEdit = [];
  deletedItemsInArray = [];
  formValueChanges=false;
  attain = ['A degree', 'A diploma', 'A scholarship'];
  status = [
    'Married',
    'Divorced',
    'Undergoing critical illness',
    'Certify a special need',
  ];
  counter(i: number) {
    return new Array(i);
  }

  constructor(
    private _fb: FormBuilder,
    private memberServices: MembersService,
    private _willServices: WillService,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService,
  ) {}
  createForm() {
    this.payoutForm = this._fb.group({
      payout_type: [, [Validators.required]],

      sourceOfPayout: [],
      denominationOfPayout: [],
      frequencyOfPayout: [],
      textAreaFrequencyOfPayout:[],
      // condittion of payout
      ifBenificiaryTurns: [],
      ifBenificiaryAttains: [],
      ifBenificiaryIs: [],
      customField: [],

      conditionsOfPayout1: [false],
      conditionsOfPayout2: [false],
      conditionsOfPayout3: [false],
      conditionsOfPayout4: [false],

      purposeOfPayout: [],

      fallBackType: ['Do not Pay'],
      description: ['Do not Pay'],

      appointBenificiaries: [],
    });
    this.payoutForm.valueChanges.subscribe(() => {
      this.formValueChanges=true;
    });
  }
  closeModalHandler() {
    this.payoutForm.patchValue({
      payout_type: null,
    });
  }
  onSelectFallback(e) {
    //console.log();
    this.fallbackChecked = e.target.checked;
  }
  selectCircularMembers(value){
    this.deletedItemsInArray=value;
        //console.log(value);
        this.payoutForm.patchValue({
          appointBenificiaries:value,
        })  
  }
  selectMemberExecutor(value) {
    this.selectedItemFromEdit=value;
    this.deletedItemsInArray=value;
    this.payoutForm.patchValue({
      appointBenificiaries: this.selectedItemFromEdit
    }); 
       
  }
  onSavePayout() {
    const addAPayout = {
      sourceOfPayout: this.payoutForm.value.sourceOfPayout,
      denominationOfPayout: this.payoutForm.value.denominationOfPayout,
      frequencyOfPayout: this.payoutForm.value.frequencyOfPayout==='custom'?this.payoutForm.value.textAreaFrequencyOfPayout:this.payoutForm.value.frequencyOfPayout,
      conditionsOfPayout: {
        ifBenificiaryTurns: this.payoutForm.value.conditionsOfPayout1
          ? this.payoutForm.value.ifBenificiaryTurns
          : '',
        ifBenificiaryAttains: this.payoutForm.value.conditionsOfPayout2
          ? this.payoutForm.value.ifBenificiaryAttains
          : '',
        ifBenificiaryIs: this.payoutForm.value.conditionsOfPayout3
          ? this.payoutForm.value.ifBenificiaryIs
          : '',
        customField: this.payoutForm.value.conditionsOfPayout4
          ? this.payoutForm.value.customField
          : '',
      },
      purposeOfPayout: this.payoutForm.value.purposeOfPayout,
      fallback: {
        fallbackType:this.fallbackChecked?
          (this.payoutForm.value.fallBackType === 'Activate Terminal Clause'
            ? this.payoutForm.value.description
            : this.payoutForm.value.fallBackType):null,
      },
      appointBenificiaries: this.payoutForm.value.appointBenificiaries,
    };
if (this.formValueChanges) {
  this.onSaveData.emit(addAPayout);
}
    //console.log(addAPayout);
    
    this.onClickback.emit();
  }

  ngOnInit(): void {
    this.createForm();
    this.memberServices.getMembers().subscribe(
      (result) => {
        // //console.log(result.data);
        this.spinner.stop();
        this.memberData = result.data.map((items, i) => {
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
        });
        // //console.log(this.allMemberData);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message('Error Getting Members data !!', false);
      }
    );
  }
}
