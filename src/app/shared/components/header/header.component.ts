import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UserService } from 'src/app/services/user.service';
import { WillService } from 'src/app/services/will.service';
import { environment } from 'src/environments/environment.prod';
import { HeaderService } from '../../../services/header.service';
import { ToastrService } from '../../services/toastr.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  username: string = 'helloo';
  imageSrc: string = '';
  defaultMale = '../../../../assets/Image/male.png';
  defaultFemale = '../../../../assets/Image/female.png';
  toggleModal: boolean = false;
  latestWillId='';
  latestWillData=[];
  constructor(
    public router: Router,
    public _headerServ: HeaderService,
    private _userServ: UserService,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService,
    private _route:Router,
    private route: ActivatedRoute,
    private _willServices: WillService,
    private _subscription: SubscriptionService,
  ) {
    this._headerServ.username.subscribe((name) => {
      this.username = name.split(' ')
   .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
   .join(' ');
    });
  }
  key = ['willType', 'date'];
  logout() {
    localStorage.removeItem('user');
  }
  latestWill() {
    console.log('latest Will');
    this._route.navigate([`will/createWill`], { queryParams:{wid:this.latestWillId}});
  }
  willpresent=false;
  wid='';
  routeToWill(){
    
  }
  ngOnInit(): void {
    
    this.route.queryParams.subscribe(({ wid,re}) => {
      if (wid) {
        this.wid = wid;
      }

     
    });
    this.spinner.start();
    this._willServices.willpresent.subscribe((result)=>{
      this.willpresent=result;
    });
    this._headerServ.image.subscribe((image) => {
      this.imageSrc = image;
    });
    this._userServ.getProfile().subscribe((result) => {
      
      this.username = result.data.fullName.split(' ')
   .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
   .join(' ');

   this._subscription.subscriptionActive.next(result.data?.subscriptionData?.isActive || false);
   this._subscription.subscriptionDetails.next(result.data?.subscriptionData || { isActive:false});
   this._subscription.isfreeTrialValid.next(result.data?.isfreeTrialValid || true);
      const setImageHandler = (result) => {
        if ((result.data.gender === 'male' || result.data.gender === 'other') && !result.data.profileImage) {
          this.imageSrc = this.defaultMale;
        } else if (
          result.data.gender === 'female' &&
          !result.data.profileImage
        ) {
          this.imageSrc = this.defaultFemale;
        } else if (

          result.data.profileImage !== '' &&
          result.data.profileImage !== null
        ) {
          this.imageSrc = `${environment.serverUrl}${result.data.profileImage}`;
        }
      };
      setImageHandler(result);
    },(err)=>{
      this.spinner.stop();
      this.toastr.message("Error Getting User Data!!",false);
    });
    this._willServices.getAllWill().subscribe(
      (result) => {
        console.log(result);
        
        if(result.data.length > 0){
        this.latestWillData = result.data[result.data.length-1]?.DATE ;
        this.latestWillId=result.data[result.data.length-1]?._id || '';
        console.log(this.latestWillData);
        console.log(this.latestWillId);
        this._willServices.latestWillId.next(result.data[result.data.length-1]?._id);
        }
        this.spinner.stop();
        console.log(this.latestWillId);
      },
      (err) => {
        this.spinner.stop();
      }
    );

  }
}
