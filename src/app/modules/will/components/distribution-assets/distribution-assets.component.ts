import { Component, OnInit, Output ,EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { errorHandler, valueChanges } from 'src/app/helper/formerror.helper';
import { AssetsService } from 'src/app/services/assets.service';
import { LiabilitiesService } from 'src/app/services/liabilities.service';
import { MembersService } from 'src/app/services/members.service';
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
    private _willServices: WillService,
    private memberServices: MembersService,
  ) {
    
  }

  distributeAssetsForm: FormGroup;
  createForm() {
    this.distributeAssetsForm = this._fb.group({
          /// Liabilities
      liabilitiesData: [[], [Validators.required]],
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
    liabilitiesData: '',
    assets: '',
    trust: '',
  };
  formErrorMessages = {
    assets: {
      required: 'Please Select Asset',
    },
    liabilitiesData: {
      required: 'Please Select Liabilities',
    },
    trust: {
      required: 'Please Select Trust',
    },
  };
  memberData=[];
  mergeById(a1, a2) {
    return a1.map((itm) => ({
      ...a2.find((item) => item === itm._id && item),
      ...itm,
    }));
  }
  mergeBy_Id(a1, a2) {
    return a1.map((itm) => ({
      ...a2.find((item) => item._id === itm._id && item),
      ...itm,
    }));
  }
  mergeBy_Id_trustData(a1, a2) {
    return a1.map((itm) => ({
      ...a2.find((item) => item.trustData === itm._id && item),
      ...itm,
      trustData:itm._id
    }));
  }
  
  //assets
  keyAssets = ['nameofAssets', 'uniqueNumber'];
  classes = ['font-bold', 'font-bold', 'text-sm'];
  assetsData = [];
  
  selectAssets(value) {
    console.log(value);
    
    console.log(this.allAssetsBeneficiary);
    let memberData = this.allAssetsBeneficiary.filter(o1 => value.some(o2 => o2._id === o1.assetId));
    console.table("memberre tabala",memberData);
    this.step3AssetData=value;
    console.log(this.step3AssetData);
    const assets=value.map((el)=>{
      let data =memberData.filter((i)=>i.assetId===el._id);
     data= data.map((el2)=>({
        member: el2._id,
        specify_Shares: el2.share
      }))
      console.log(data);
    return {assetData:el._id,membersData:data}
    })
    console.log(assets);
    
    this.distributeAssetsForm.patchValue({
      assets: assets,
    });

    // console.log(this.distributeAssetsForm.value.assets);
  }

  //liabilities
  KeysLiability = ['loanName', 'loanProvider'];
  allLiabilitiesData = [];

  selectLiabilities(value) {

    this.distributeAssetsForm.patchValue({
      liabilitiesData: value,
    });

    // console.log(this.distributeAssetsForm.value.liabilities);
  }

  //trust
  trustData = [];
  KeysTrust = ['trustName', 'ownerShipType'];
  selectTrust(value) {
    this.distributeAssetsForm.patchValue({
      trust: value,
    });

    console.log(this.distributeAssetsForm.value.trust);
  }
  onClickNext(){
    this.onClickNextBtn.emit(4)
    console.log(this.step3AssetData);
    console.log(this.distributeAssetsForm.value.trust);
    console.log(this.allTrustAdditionalData);
    const trustIdData = this.mergeBy_Id_trustData(this.distributeAssetsForm.value.trust,this.allTrustAdditionalData); 
    
    
    this.distributeAssetsForm.patchValue({
      trust: trustIdData,
    });
    console.log(trustIdData);
    this.step3AssetData= this.mergeBy_Id(this.step3AssetData,this.assetsData)
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
      console.log(value);
      
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
      
        console.log(this._willServices.assetsBeneficiary.getValue());
          this.allAssetsBeneficiary=this.mergeBy_Id(this._willServices.assetsBeneficiary.getValue(), this.memberData);
          console.log(this.allAssetsBeneficiary);
          

        this._willServices.assetsBeneficiary.next(this.allAssetsBeneficiary);
        console.log(this.allAssetsBeneficiary);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message('Error Getting Members data !!', false);
      }
    );  


    this._willServices.allTrustAdditionalData.subscribe((value) => {
      console.log(value);
      this.allTrustAdditionalData =value;
      
    });

    this._willServices.step3AssetData.subscribe((step3AssetData) => {
      // console.log(step3AssetData);
      this.step3AssetData=step3AssetData;

    });
    this._willServices.step3.subscribe((step3Data) => {
      console.log(step3Data);
      this.distributeAssetsForm.patchValue(step3Data);

      console.log(step3Data['aaset']);
      console.log(step3Data['trust']);
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
