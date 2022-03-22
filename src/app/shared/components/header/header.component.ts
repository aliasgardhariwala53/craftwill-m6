import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
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
  latestWillId:'';
  latestWillData=[];
  constructor(
    public router: Router,
    public _headerServ: HeaderService,
    private _userServ: UserService,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService,
    private _route:Router,
    private _willServices: WillService,
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
    this._route.navigate([`will/createWill`], { queryParams:{id:this.latestWillId}});
  }

  ngOnInit(): void {
    this._headerServ.image.subscribe((image) => {
      this.imageSrc = image;
    });
    this._userServ.getProfile().subscribe((result) => {
      this.spinner.stop();
      this.username = result.data.fullName.split(' ')
   .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
   .join(' ');

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
        this.spinner.stop();
        this.latestWillData = result.data?.users[result.data.users.length-1]?.DATE ;
        this.latestWillId=result.data?.users[result.data.users.length-1]?._id || '';
        console.log(this.latestWillData);
        console.log(this.latestWillId);
        this._willServices.latestWillId.next(result.data?.users[result.data.users.length-1]?._id);
      },
      (err) => {
        this.spinner.stop();
      }
    );
  }
}
