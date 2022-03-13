import {
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { combineLatest } from 'rxjs';
import { errorHandler } from 'src/app/helper/formerror.helper';
import { AssetsService } from 'src/app/services/assets.service';
import { MembersService } from 'src/app/services/members.service';
import { WillService } from 'src/app/services/will.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
@Component({
  selector: 'app-review-will',
  templateUrl: './review-will.component.html',
  styleUrls: ['./review-will.component.scss'],
})
export class ReviewWillComponent implements OnInit, OnChanges {
  @Output() onEdit = new EventEmitter();
  step1;
  step2;
  step3;
  step4;
  step5;

  list;
  id;
  // step 2
  primary_executor_type;
  replacement_executor_type;
  addPrimaryExecutor;
  addReplacementExecutor;
  //
  guardian_executor_type;
  guardian_replacement_executor_type;
  addGuardianExecutor;
  addGuardianReplacementExecutor;
  //

  // step-3
  step3liabilities = [];
  step3lender;
  step3assets = [];
  step3trust = [];
  assetsData = [];
  memberData = [];

  allAssetsBeneficiary;
  step3AssetData;
  keyAssets = ['nameofAssets', 'uniqueNumber'];
  key = ['nameofAssets', 'uniqueNumber'];
  keydistributeAssets = ['fullname', 'Relationship'];
  classes = ['font-bold', 'font-bold', 'text-sm'];

  // step4
  step4ResidualAssets;
  constructor(
    private _willServices: WillService,
    private _router: Router,
    private toastr: ToastrService,
    private assetsServices: AssetsService,
    private memberServices: MembersService,
    private spinner: NgxUiLoaderService,
    private route: ActivatedRoute,
  ) {}
  slectedDelayMember;
  delayType = '';
  mergeById(a1, a2) {
    return a1.map((itm) => ({
      ...a2.find((item) => item === itm._id && item),
      ...itm,
    }));
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.step3lender);
    console.log(this.step3liabilities);
    this.step3lender = this.step3liabilities['lender'];
  }
  idMapper(arr){
        return arr.map((el)=>el._id);
  }
  onCreateWill() {
    console.log();
    const obj = {
      ...this.step1,
      ...this.step2,
      addPrimaryExecutor:this.idMapper(this.step2.addPrimaryExecutor),
      addReplacementExecutor:this.idMapper(this.step2.addReplacementExecutor),
      addGuardianExecutor:this.idMapper(this.step2.addGuardianExecutor),
      addGuardianReplacementExecutor:this.idMapper(this.step2.addGuardianReplacementExecutor),
      ...this.step3,
      ...this.step4,
      ...this.step5,
    };
    this._willServices.createWill(obj).subscribe(
      (result) => {
        this.spinner.stop();
        this.toastr.message(result.message, result.success);
        if (result.success == true) {
          this._willServices.step1.next({});
          this._willServices.step2.next({});
          this._willServices.step3.next({});
          this._willServices.step4.next({});
          this._willServices.step5.next({});
  
          // this.userRegistration.reset();
          // this.addressDetails.reset();
          // this.accountDetails.reset();
          this.toastr.message('Will Created Successfully....', true);
        }
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message(errorHandler(err), false);
      }
    );
  }
  onEditClick(step) {
    console.log(step);
    this.onEdit.emit(step);
  }
  onUpdateWill(){
    const obj = {
      ...this.step1,
      ...this.step2,
      addPrimaryExecutor:this.idMapper(this.step2.addPrimaryExecutor),
      addReplacementExecutor:this.idMapper(this.step2.addReplacementExecutor),
      addGuardianExecutor:this.idMapper(this.step2.addGuardianExecutor),
      addGuardianReplacementExecutor:this.idMapper(this.step2.addGuardianReplacementExecutor),
      ...this.step3,
      ...this.step4,
      ...this.step5,
    };
    this._willServices.updateWill(obj,this.id).subscribe(
      (result) => {
        this.spinner.stop();
        this.toastr.message(result.message, result.success);
        if (result.success == true) {
          this._willServices.step1.next({});
          this._willServices.step2.next({});
          this._willServices.step3.next({});
          this._willServices.step4.next({});
          this._willServices.step5.next({});
  
          this.toastr.message('Will Updated Successfully....', true);
        }
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message(errorHandler(err), false);
      }
    );
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(({ id}) => {
      if (id) {
        this.id = id;
      }
     
    });
    this._willServices.step2.subscribe((step2Data) => {
      console.log(step2Data);
      this.primary_executor_type = step2Data['primary_executor_type'];
      this.replacement_executor_type = step2Data['replacement_executor_type'];
      this.addPrimaryExecutor = step2Data['addPrimaryExecutor'];
      this.addReplacementExecutor = step2Data['addReplacementExecutor'];

      this.guardian_executor_type = step2Data['guardian_executor_type'];
      this.guardian_replacement_executor_type =
      step2Data['guardian_replacement_executor_type'];
      this.addGuardianExecutor = step2Data['addGuardianExecutor'];
      this.addGuardianReplacementExecutor =
        step2Data['addGuardianReplacementExecutor'];
    });
    this.assetsServices.getAssets().subscribe(
      (result) => {
        this.spinner.stop();
        this.assetsData = result.data.map((items, i) => {
          return {
            nameofAssets: this.assetsServices.getAssetsData(items)?.name,
            uniqueNumber:
              this.assetsServices.getAssetsData(items)?.uniqueNumber,
            country: items.country,
            ownerShip: items.specifyOwnershipType,
            type: items.type,
            _id: items._id,
            actionRoute: this.assetsServices.getAssetsData(items)?.actionRoute,
            image: this.assetsServices.getAssetsData(items)?.img,
          };
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
            this._willServices.step3.subscribe((step3Data) => {
              this.step3liabilities = step3Data['liabilities'];

              this.step3assets = step3Data['assets'];
              console.log(step3Data);
              this.step3trust = step3Data['trust'];
              this.step3liabilities = this.step3liabilities?.map((el) => {
                const newData = { ...el };
                if (el?.type === 'securedLoan') {
                  newData.assetId = el['assetId']?.map((a) => {
                    return this.assetsData.find((el2) => el2._id === a);
                  });
                } else if (el?.type === 'privateDept') {
                  newData.lender = el['lender']?.map((a) => {
                    console.log(this.memberData);
                    console.log(a);

                    return this.memberData?.find((el2) => el2?._id === a);
                  });
                }
                return newData;
              });
            });
            console.log(this.step3liabilities);

            console.log(this.step3lender);
          },
          (err) => {
            this.spinner.stop();
          }
        );
      },
      (err) => {
        this.spinner.stop();
      }
    );

    this._willServices.assetsBeneficiary.subscribe((value) => {
      this.allAssetsBeneficiary = value;
    });
    this._willServices.step3AssetData.subscribe((step3AssetData) => {
      this.step3AssetData = step3AssetData;
      console.log(this.step3AssetData);
    });

    combineLatest(
      this._willServices.step1,
      this._willServices.step2,
      this._willServices.step3,
      this._willServices.step4,
      this._willServices.step5
    ).subscribe(([step1, step2, step3, step4, step5]) => {
      this.step4ResidualAssets = step4['residualMemberId'];
      this.step1 = step1;
      this.step2 = step2;
      this.step3 = step3;
      this.step4 = step4;
      this.step5 = step5;

      console.log(step1, step2, step3, step4, step5);
    });
  }
}
