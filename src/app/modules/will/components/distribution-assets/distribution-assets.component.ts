import { Component, OnInit, Output ,EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { errorHandler, valueChanges } from 'src/app/helper/formerror.helper';
import { AssetsService } from 'src/app/services/assets.service';
import { LiabilitiesService } from 'src/app/services/liabilities.service';
import { TrustService } from 'src/app/services/trust.service';
import { WillService } from 'src/app/services/will.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
@Component({
  selector: 'app-distribution-assets',
  templateUrl: './distribution-assets.component.html',
  styleUrls: ['./distribution-assets.component.scss'],
})
export class DistributionAssetsComponent implements OnInit {
  @Output() onClickNextBtn = new EventEmitter();
  toggleModalTutorial:boolean=false;
  allAssetsBeneficiary;
  step3AssetData;
  allTrustAdditionalData=[];
  constructor(
    private assetsServices: AssetsService,
    private _fb: FormBuilder,
    private spinner: NgxUiLoaderService,
    private liabilitiesServices: LiabilitiesService,
    private trustServices: TrustService,
    private toastr: ToastrService,
    private _willServices: WillService
  ) {
    
  }

  distributeAssetsForm: FormGroup;
  createForm() {
    this.distributeAssetsForm = this._fb.group({
          /// Liabilities
      liabilities: [[], [Validators.required]],
          ///Assets
      assets: [[], [Validators.required]],
///trust
      trust: [[], [Validators.required]],
    });
    this.distributeAssetsForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.distributeAssetsForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
  }
  formErrors = {
    liabilities: '',
    assets: '',
    trust: '',
  };
  formErrorMessages = {
    assets: {
      required: 'Please Select Asset',
    },
    liabilities: {
      required: 'Please Select Liabilities',
    },
    trust: {
      required: 'Please Select Trust',
    },
  };

  //assets
  keyAssets = ['nameofAssets', 'uniqueNumber'];
  classes = ['font-bold', 'font-bold', 'text-sm'];
  assetsData = [];
  selectAssets(value) {
    // console.log(value);
    let memberData = this.allAssetsBeneficiary.filter(o1 => value.some(o2 => o1.assetId === o2._id));
    // console.log(this.allAssetsBeneficiary);
    // console.log(memberData);
    this.step3AssetData=value;
    const assets=value.map((el)=>{
      const data =memberData.filter((i)=>i.assetId===el._id);
    return {assetData:el._id,memberData:data}
    })
    this.distributeAssetsForm.patchValue({
      assets: assets,
    });

    // console.log(this.distributeAssetsForm.value.assets);
  }

  //liabilities
  KeysLiability = ['loanName', 'loanProvider'];
  LiabilitiesData = [];

  selectLiabilities(value) {

    this.distributeAssetsForm.patchValue({
      liabilities: value,
    });

    // console.log(this.distributeAssetsForm.value.liabilities);
  }

  //trust
  trustData = [];
  KeysTrust = ['trustName', 'ownerShipType'];
  selectTrust(value) {
    let trustId: Array<any> =
      this.distributeAssetsForm.value.trust;
    if (trustId?.includes(value)) {
      trustId.splice(trustId.indexOf(value), 1);
    } else {
      trustId?.push(value);
    }
    this.distributeAssetsForm.patchValue({
      trust: trustId,
    });

    // console.log(this.distributeAssetsForm.value.assets);
  }
  onClickNext(){
    this.onClickNextBtn.emit(4)
    // console.log(this.distributeAssetsForm.value);
    
    this._willServices.step3.next(this.distributeAssetsForm.value);
    this._willServices.step3AssetData.next(this.step3AssetData);
  }
  onUpdateAssets(value){
  // console.log(value);

  }
  ngOnInit(): void {
    this.createForm();
    this._willServices.assetsBeneficiary.subscribe((value) => {
      this.allAssetsBeneficiary=value;
      
    });
    this._willServices.allTrustAdditionalData.subscribe((value) => {
      // console.log(value);
      this.allTrustAdditionalData =value;
      
    });
    this._willServices.step3.subscribe((step3Data) => {
      // console.log(step3Data);
      this.distributeAssetsForm.setValue(step3Data);

    });
    this._willServices.step3AssetData.subscribe((step3AssetData) => {
      // console.log(step3AssetData);
      this.step3AssetData=step3AssetData;

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
      },
      (err) => {
        this.spinner.stop();
      }
    );

    this.liabilitiesServices.getAllLiabilities().subscribe(
      (result) => {
        console.log(result);
        
        this.spinner.stop();
        this.LiabilitiesData = result.data.map((items, i) => {
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
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message('Error getting Liabilities Data!!!', false);
      }
    );

    this.trustServices.getTrust().subscribe(
      (result) => {
        this.spinner.stop();

        this.trustData = result.data.users.map((items, i) => {
          return {
            trustName: items.trustName,
            ownerShipType: 'sole',
            _id: items._id,
            actionRoute: 'trust/createTrust',
          };
        });
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message(errorHandler(err), false);
      }
    );


  }
}
