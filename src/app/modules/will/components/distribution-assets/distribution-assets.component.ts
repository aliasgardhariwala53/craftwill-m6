import { Component, OnInit, Output ,EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { errorHandler, valueChanges } from 'src/app/helper/formerror.helper';
import { AssetsService } from 'src/app/services/assets.service';
import { LiabilitiesService } from 'src/app/services/liabilities.service';
import { TrustService } from 'src/app/services/trust.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
@Component({
  selector: 'app-distribution-assets',
  templateUrl: './distribution-assets.component.html',
  styleUrls: ['./distribution-assets.component.scss'],
})
export class DistributionAssetsComponent implements OnInit {
  @Output() onClickNextBtn = new EventEmitter();
  toggleModalTutorial:boolean=false;
  constructor(
    private assetsServices: AssetsService,
    private _fb: FormBuilder,
    private spinner: NgxUiLoaderService,
    private liabilitiesServices: LiabilitiesService,
    private trustServices: TrustService,
    private toastr: ToastrService
  ) {}

  distributeAssetsForm: FormGroup;
  createForm() {
    this.distributeAssetsForm = this._fb.group({
      assetId: [[], [Validators.required]],
      liabilitiesId: [[], [Validators.required]],
      trustId: [[], [Validators.required]],
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
    trustId: '',
  };
  formErrorMessages = {
    assetId: {
      required: 'Please Select Asset',
    },
    liabilitiesId: {
      required: 'Please Select Liabilities',
    },
    trustId: {
      required: 'Please Select Trust',
    },
  };

  //assets
  keyAssets = ['nameofAssets', 'uniqueNumber'];
  classes = ['font-bold', 'font-bold', 'text-sm'];
  assetsData = [];
  selectedAssetsId;
  selectAssets(value) {
    console.log(value);

    let assetId: Array<any> = this.distributeAssetsForm.value.assetId;
    if (assetId?.includes(value)) {
      assetId.splice(assetId.indexOf(value), 1);
    } else {
      assetId?.push(value);
    }
    this.selectedAssetsId = assetId;
    this.distributeAssetsForm.patchValue({
      assetId: assetId,
    });

    console.log(this.distributeAssetsForm.value.assetId);
  }

  //liabilities
  KeysLiability = ['loanName', 'loanProvider'];
  LiabilitiesData = [];
  slectedLiabilitiesId;

  selectLiabilities(value) {
    let liabilitiesId: Array<any> =
      this.distributeAssetsForm.value.liabilitiesId;
    if (liabilitiesId?.includes(value)) {
      liabilitiesId.splice(liabilitiesId.indexOf(value), 1);
    } else {
      liabilitiesId?.push(value);
    }
    this.slectedLiabilitiesId = liabilitiesId;
    this.distributeAssetsForm.patchValue({
      liabilitiesId: liabilitiesId,
    });

    console.log(this.distributeAssetsForm.value.assetId);
  }

  //trust
  trustData = [];
  slectedTrustId;
  KeysTrust = ['trustName', 'ownerShipType'];
  selectTrust(value) {
    let trustId: Array<any> =
      this.distributeAssetsForm.value.trustId;
    if (trustId?.includes(value)) {
      trustId.splice(trustId.indexOf(value), 1);
    } else {
      trustId?.push(value);
    }
    this.slectedTrustId = trustId;
    this.distributeAssetsForm.patchValue({
      slectedTrustId: trustId,
    });

    console.log(this.distributeAssetsForm.value.assetId);
  }
  onClickNext(){
    this.onClickNextBtn.emit(2)
  }
  onUpdateAssets(value){
  console.log(value);

  }
  ngOnInit(): void {
    this.createForm();

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
        this.spinner.stop();
        this.LiabilitiesData = result.data.map((items, i) => {
          return {
            loanName:
              this.liabilitiesServices.getLiabilitiesData(items)?.loanName,
            loanProvider:
              this.liabilitiesServices.getLiabilitiesData(items)?.loanProvider,
            loanNumber:
              this.liabilitiesServices.getLiabilitiesData(items)
                ?.loan_Id_Number,
            current_Outstanding_Amount: items.current_Outstanding_Amount,
            type: items.type,
            _id: items._id,
            actionRoute:
              this.liabilitiesServices.getLiabilitiesData(items)?.actionRoute,
          };
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
