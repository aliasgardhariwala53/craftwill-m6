import { Component, createPlatform, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  errorHandler,
  passwordValidation,
  passwordValidationNotMatch,
  valueChanges,
} from 'src/app/helper/formerror.helper';
import { HeaderService } from 'src/app/services/header.service';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { countries } from 'src/app/shared/utils/countries-store';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss', '../../../../app.component.scss'],
})
export class ProfileComponent implements OnInit {
  public countries: any = countries;
  profileData;
  userInfo: FormGroup;
  passwordForm: FormGroup;
  inputState = true;
  disablePassword = true;
  imageChangedEvent: any = '';
  showCropped: boolean = false;
  showImageUpload: boolean = false;
  toggleModalTutorial: boolean = false;
  croppedImage: any = '';
  imageSrc: string = '';
  showRemoveButton: boolean = true;
  userImage: string = 'uploads/1641650621550Capture.PNG';
  genderList = ['Male', 'Female', 'Other'];
  defaultMale = '../../../../../assets/Image/male.png';
  defaultFemale = '../../../../../assets/Image/female.png';
  createForm() {
    this.userInfo = this._fb.group({
      fullName: [''],
      email: [''],
      id_type: [''],
      id_number: [''],
      gender: [''],
      floorNumber: [''],
      unitNumber: [''],
      streetName: [''],
      postalCode: [''],
      id_country: [''],
      dob: [''],
      Citizenship: [''],
      profileImage: [''],
    });
    this.passwordForm = this._fb.group(
      {
        password: [
          '0000000000000000',
          [Validators.required, Validators.minLength(6)],
        ],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      {
        validators: [
          passwordValidation.match('newPassword', 'confirmPassword'),
          // !passwordValidation.match('password', 'newPassword'),
          passwordValidationNotMatch.Notmatch('password', 'newPassword'),
        ],
      }
    );
    this.userInfo.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.userInfo,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
    this.passwordForm.valueChanges.subscribe(() => {
      this.formErrors = valueChanges(
        this.passwordForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
    });
  }
  formErrors = {
    id_type: '',
    id_number: '',
    gender: '',
    fullName: '',
    email: '',
    floorNumber: '',
    unitNumber: '',
    streetName: '',
    postalCode: '',
    Citizenship: '',
    dob: '',
    newPassword: '',
    confirmPassword: '',
    password: '',
  };

  formErrorMessages = {
    id_type: {
      required: 'Id Type is Required',
    },
    id_number: {
      required: 'Id Number is Required',
    },
    gender: {
      required: 'Gender is Required',
    },
    fullName: {
      required: 'FullName is Required',
    },
    email: {
      required: 'Email is Required',
      pattern: 'Valid email is Required',
    },
    password: {
      required: 'Password is Required',
      minlength: 'Minimum length of password must be 6',
    },
    floorNumber: {
      required: 'Floor Number is Required',
    },
    unitNumber: {
      required: 'Unit Number is Required',
    },
    streetName: {
      required: 'Street Name is Required',
    },
    postalCode: {
      required: 'Postal Code is Required',
      // pattern: 'Please Enter valid numeric value',
    },
    newPassword: {
      required: 'New Password is Required',
      minlength: 'Minimum length must be 6',
      Notmatching: 'Current Password and New password should Not be same',
    },
    confirmPassword: {
      required: 'Confirm Password is Required',
      minlength: 'Minimum length must be 6',
      matching: 'New Password and confirm password should be same',
    },
  };

  constructor(
    private _fb: FormBuilder,
    private _userServ: UserService,
    private _headerServ: HeaderService,
    private toastr: ToastrService,
    private spinner: NgxUiLoaderService
  ) {}

  DataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',');
    const byteString =
      splitDataURI[0].indexOf('base64') >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);
    return new Blob([ia], { type: mimeString });
  }
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.showImageUpload = true;
    if (event.target.value.length === 0) {
      this.showImageUpload = false;
    }
    console.log(event.target.value);
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
  changeStatus() {
    if (this.inputState === false) {
      this.userInfo.setValue({ ...this.profileData });
    }
    this.inputState = !this.inputState;
  }
  togglePassword() {
    this.passwordForm.reset();
    this.disablePassword = !this.disablePassword;
  }
  setImageHandler(result) {
    
    if ((result.data.gender === 'male' || result.data.gender === 'other') && !result.data.profileImage) {
      console.log(result.data.gender);
      this.imageSrc = this.defaultMale;
      this._headerServ.image.next(this.defaultMale);
      this.showRemoveButton = false;
    } else if (result.data.gender === 'female' && !result.data.profileImage) {
      this.imageSrc = this.defaultFemale;
      this._headerServ.image.next(this.defaultFemale);
      this.showRemoveButton = false;
    } else if (
      result.data.profileImage !== '' &&
      result.data.profileImage !== null
    ) {
      console.log(result);
      this.imageSrc = `${environment.serverUrl}${result.data.profileImage}`;
      this._headerServ.image.next(
        `${environment.serverUrl}${result.data.profileImage}`
      );
      this.showRemoveButton = true;
    }
  }
  // click remove button
  remove() {
    this.toggleModalTutorial = false;
    this.spinner.start();
    this._userServ.imageUpload(null).subscribe(
      (result) => {
        this.spinner.stop();
        this.toastr.message(
          result.success ? 'Image Removed SuccessFully' : 'Image Remove Error',
          result.success
        );
        this.setImageHandler(result);
        this.showRemoveButton = false;
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message('Something Went Wrong!!!', false);
      }
    );
  }

  // click preview button
  showcroppedImage() {
    this.showCropped = !this.showCropped;
  }
  // click cancel button
  onCancel() {
    this.showImageUpload = false;
    this.showCropped = false;
    this.imageChangedEvent = null;
  }
  // click back button
  onBack() {
    this.showCropped = false;
  }
  //on click save
  uploadImage() {
    this.spinner.start();
    let form = new FormData();
    const profilePic = this.DataURIToBlob(this.croppedImage);
    form.append('attachments', profilePic);
    console.log(profilePic);
    console.log(form);

    this._userServ.imageUpload(form).subscribe(
      (result) => {
        this.spinner.stop();
        this.toastr.message(result.message, result.success);
        if (result.success === true) {
          this._headerServ.image.next(this.croppedImage);
          this.imageSrc = this.croppedImage;
          this.showImageUpload = false;
          this.showCropped = false;
          this.showRemoveButton = true;
          this.imageChangedEvent = null;
        }
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message('Something Went Wrong!!!', false);
      }
    );
  }

  profileUpdate() {
    if (this.userInfo.invalid) {
      this.userInfo.markAllAsTouched();
      this.formErrors = valueChanges(
        this.userInfo,
        { ...this.formErrors },
        this.formErrorMessages
      );
      return;
    }
    this.spinner.start();
    const profiledate = {
      ...this.userInfo.value,
      gender: this.userInfo.value.gender.toLowerCase(),
    };
    this._userServ.updateProfile(profiledate).subscribe(
      (result) => {
        console.log(result);
        this.profileData = (({
          id_type,
          id_number,
          gender,
          fullName,
          email,
          floorNumber,
          unitNumber,
          streetName,
          postalCode,
          Citizenship,
          id_country,
          dob,
        }) => ({
          id_type,
          id_number,
          gender:
            result.data.gender.charAt(0).toUpperCase() +
            result.data.gender.slice(1),
          fullName,
          email,
          floorNumber,
          unitNumber,
          streetName,
          postalCode,
          Citizenship,
          id_country,
          dob,
        }))(result.data);
        this.setImageHandler(result);

        // this.userInfo.setValue({ ...result.data });
        if (result.success) {
          this.inputState = true;
          this.spinner.stop();
        }
        this.spinner.stop();
        this.toastr.message(result.message, result.success);
      },(err)=>{
        this.spinner.stop();
        this.toastr.message("Something Went Wrong!!!",false);
          });
    this._headerServ.username.next(this.userInfo.value.fullName);
  }
  logout() {
    localStorage.removeItem('user');
  }
  passwordUpdate() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.formErrors = valueChanges(
        this.passwordForm,
        { ...this.formErrors },
        this.formErrorMessages
      );
      return;
    }
    this.spinner.start();
    this._userServ.updatePassword(this.passwordForm.value).subscribe(
      (result) => {
        if (result.success) {
          this.passwordForm.reset();
          this.disablePassword = true;
        }
        this.spinner.stop();
        this.toastr.message(result.message, result.success);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message(err.text, false);
        console.log(err);
      }
    );
  }
  ngOnInit(): void {
    this.createForm();
    this.spinner.start();
    this._userServ.getProfile().subscribe(
      (result) => {
        this.spinner.stop();
        this.profileData = {
          ...result.data,
          gender:
            result.data.gender.charAt(0).toUpperCase() +
            result.data.gender.slice(1),
        };
        this.userInfo.setValue({
          ...result.data,
          gender:
            result.data.gender.charAt(0).toUpperCase() +
            result.data.gender.slice(1),
        });
        this._headerServ.username.next(result.data.fullName);
        console.log(result);
        this.setImageHandler(result);
      },(err)=>{
        this.spinner.stop();
        this.toastr.message("Something Went Wrong!!!",false);
          });
  }
}
