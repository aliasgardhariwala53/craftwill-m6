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
import { LiabilitiesService } from 'src/app/services/liabilities.service';
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
  wid='';
  // step 2
  primary_executor_type;
  replacement_executor_type;
  primaryExecutors;
  replacementExecutors;
  //
  guardian_executor_type;
  guardian_replacement_executor_type;
  guardianExecutor;
  guardianReplacementExecutor;
  //

  // step-3
  step3liabilities = [];
  step3lender;
  step3assets = [];
  step3trust = [];
  assetsData = [];
  memberData = [];
  allLiabilitiesData=[];
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
    private _route: Router,
    private liabilitiesServices: LiabilitiesService,
  ) {}
  slectedDelayMember;
  delayType = '';
  mergeById(a1, a2) {
    return a1.map((itm) => ({
      ...a2.find((item) => item === itm._id && item),
      ...itm,
    }));
  }
  mergeBy_Id(a1, a2) {
    return a1?.map((itm) => ({
      ...a2?.find((item) => item._id === itm._id && item),
      ...itm,
    }));
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.step3lender);
    console.log(this.step3liabilities);
    this.step3lender = this.step3liabilities['lender'];
  }
  idMapper(arr){
        return arr?.map((el)=>el?._id);
  }
  shareMapper(arr){
    return arr?.map((el)=>({
      member:el?._id,
      specifyShares:el?.share,
    }))
  }
  onCreateWill() {
    console.log("created will callll");
    console.log(this.step3);
    
    const obj = {
      ...this.step1,
      ...this.step2,
      primaryExecutors:this.idMapper(this.step2.primaryExecutors),
      replacementExecutors:this.idMapper(this.step2.replacementExecutors),
      guardianExecutor:this.idMapper(this.step2.guardianExecutor),
      guardianReplacementExecutor:this.idMapper(this.step2.guardianReplacementExecutor),
      ...this.step3,
      liabilitiesData:this.idMapper(this.step3.liabilitiesData),
      ...this.step4,
      specifyResidualAssetBenificiary:this.shareMapper(this.step4.specifyResidualAssetBenificiary) ,
      clauses:this.step5,
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
          this._route.navigate(['/will/pastWills']);
          this._willServices.currentStep.next(1);
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
      primaryExecutors:this.idMapper(this.step2.primaryExecutors),
      replacementExecutors:this.idMapper(this.step2.replacementExecutors),
      guardianExecutor:this.idMapper(this.step2.guardianExecutor),
      guardianReplacementExecutor:this.idMapper(this.step2.guardianReplacementExecutor),
      ...this.step3,
      ...this.step4,
      specifyResidualAssetBenificiary:this.shareMapper(this.step4.specifyResidualAssetBenificiary) ,
      clauses:this.step5,
    };
    this._willServices.updateWill(obj,this.wid).subscribe(
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
          this._route.navigate(['/will/pastWills']);
          this._willServices.currentStep.next(1);
        }
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message(errorHandler(err), false);
      }
    );
  }
  getShortName(obj) { 
    const name =obj[Object.keys(obj)[0]] ;
  console.log(name);
  
    if (name && typeof(name)=='string') {
      return name?.split(' ')?.map(n => n[0])?.join('')?.toUpperCase()?.substr(0,2);
    } else {
      return "AA"
    }
   
  }
  assetHandler(arr){
    return this.mergeById(this.assetsData,arr);
  }
  memberHandler(arr){
    return this.mergeById(this.memberData,arr);
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(({ wid}) => {
      if (wid) {
        this.wid = wid;
      }
     
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

            this._willServices.step4.subscribe((step4) => {
              this.step4ResidualAssets = this.mergeBy_Id(step4['specifyResidualAssetBenificiary'],this.memberData)  || [];
              console.log(step4);
              console.log(this.step4ResidualAssets);
            });
            this._willServices.step2.subscribe((step2Data) => {
              console.log(step2Data);
              this.primary_executor_type = step2Data['primary_executor_type'];
              this.replacement_executor_type = step2Data['replacement_executor_type'];
              this.primaryExecutors = this.mergeBy_Id(step2Data['primaryExecutors'],this.memberData);
              this.replacementExecutors = this.mergeBy_Id(step2Data['replacementExecutors'],this.memberData);
        
              this.guardian_executor_type = step2Data['guardian_executor_type'];
              this.guardian_replacement_executor_type =
              step2Data['guardian_replacement_executor_type'];
              this.guardianExecutor = this.mergeBy_Id(step2Data['guardianExecutor'],this.memberData);
              this.guardianReplacementExecutor =this.mergeBy_Id(step2Data['guardianReplacementExecutor'],this.memberData);
            });
   
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
    this.liabilitiesServices.getAllLiabilities().subscribe(
      (result) => {
        console.log(result);
        
        this.spinner.stop();
        this.allLiabilitiesData = result.data.map((items, i) => {
          // console.log(items);
          const obj ={
            loanName:
              this.liabilitiesServices.getLiabilitiesData(items)?.loanName,
            loanProvider:
              this.liabilitiesServices.getLiabilitiesData(items)?.loanProvider,
            loanNumber:
              this.liabilitiesServices.getLiabilitiesData(items)
                ?.loan_Id_Number,
              current_Outstanding_Amount: items?.current_Outstanding_Amount,
              type: items?.type,
              _id: items?._id,
              actionRoute:
              this.liabilitiesServices.getLiabilitiesData(items)?.actionRoute,
          };
          if (items.type==="securedLoan") {
            obj['assetId'] =items?.securedLoan?.addAssets;
          }else if(items.type==="privateDept"){
            obj['lender'] = items?.privateDept?.lender;
          }
          console.log(obj);
          
          return obj;
        });
        this._willServices.step3.subscribe((step3Data) => {
          this.step3liabilities = this.mergeBy_Id(step3Data['liabilitiesData'],this.allLiabilitiesData);
          console.log(this.step3liabilities);
          console.log(step3Data['liabilitiesData']);

          this.step3assets = step3Data['assets'];
          console.log(step3Data);
          this.step3trust = step3Data['trust'];
          // this.step3liabilities = this.step3liabilities?.map((el) => {
          //   const newData = { ...el };
          //   if (el?.type === 'securedLoan') {
          //     newData.assetId = el['assetId']?.map((a) => {
          //       return this.assetsData.find((el2) => el2._id === a);
          //     });
          //   } else if (el?.type === 'privateDept') {
          //     newData.lender = el['lender']?.map((a) => {
          //       console.log(this.memberData);
          //       console.log(a);

          //       return this.memberData?.find((el2) => el2?._id === a);
          //     });
          //   }
          //   return newData;
          // });
        });
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message('Error getting Liabilities Data!!!', false);
      }
    );
    

    combineLatest(
      this._willServices.step1,
      this._willServices.step2,
      this._willServices.step3,
      this._willServices.step4,
      this._willServices.step5
    ).subscribe(([step1, step2, step3, step4, step5]) => {
     
      
      this.step1 = step1;
      this.step2 = step2;
      this.step3 = step3;
      this.step4 = step4;
      this.step5 = step5;
console.log(step4);

      console.log(step1, step2, step3, step4, step5);
    });
  }
}
