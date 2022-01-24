
import { Component, createPlatform, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import {
  passwordValidation,
  valueChanges,
} from 'src/app/helper/formerror.helper';
import { HeaderService } from 'src/app/services/header.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss','../../../../app.component.scss']
})
export class ProfileComponent implements OnInit {

  userInfo: FormGroup;
  passwordForm: FormGroup;
  inputState = true;
  disablePassword = true;
  imageChangedEvent: any = '';
  showCropped: boolean = false;
  showImageUpload: boolean = false;
  croppedImage: any = '';
  imageSrc: string = '';
  showRemoveButton : boolean = true;
  userImage: string = 'uploads/1641650621550Capture.PNG';

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
    });
    this.passwordForm = this._fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      {
        validators: [
          passwordValidation.match('newPassword', 'confirmPassword'),
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
      required: 'id Number is Required',
    },
    gender: {
      required: 'Gender is Required',
    },
    fullName: {
      required: 'fullName is Required',
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
      required: 'floorNumber is Required',
    },
    unitNumber: {
      required: 'unitNumber is Required',
    },
    streetName: {
      required: 'streetName is Required',
    },
    postalCode: {
      required: 'postalCode is Required',
      // pattern: 'Please Enter valid numeric value',
    },
    newPassword: {
      required: 'New Password is Required',
      minlength: 'Minimum length must be 6',
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
    private _headerServ: HeaderService
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
    this.inputState = !this.inputState;
  }
  togglePassword() {
    this.disablePassword = !this.disablePassword;
  }
    // click remove button
  remove() {
    this._userServ.imageUpload(null).subscribe((result) => {
      this.imageSrc = `https://crafttttttwilllls.herokuapp.com${result.data.profileImage}`;
      this.showRemoveButton=false;
    });
  }
  // click preview button
  showcroppedImage() {
    this.showCropped = !this.showCropped;
  }
   // click cancel button
  onCancel(){
    this.showImageUpload = false;
    this.showCropped = false;
  }
   // click back button
  onBack() {
    this.showCropped = false;
  }
  //on click save
  uploadImage() {
    let form = new FormData();
    const profilePic = this.DataURIToBlob(this.croppedImage);
    form.append('attachments', profilePic);
    console.log(profilePic);
    console.log(form);
    
    this._userServ.imageUpload(form).subscribe((result) => {
      console.log(result);
      if (result.sucess === true) {
        this.imageSrc = this.croppedImage;
        this.showImageUpload = false;
        this.showCropped = false;
        this.showRemoveButton=true;
      }
    });
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
    this._userServ.updateProfile(this.userInfo.value).subscribe((result) => {
      console.log(result);
    });
    this._headerServ.username.next(this.userInfo.value.fullName);
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
    this._userServ
      .updatePassword(this.passwordForm.value)
      .subscribe((result) => {
        console.log(result);
      });
  }
  ngOnInit(): void {
    this.createForm();
    this._userServ.getProfile().subscribe((result) => {
      console.log(result.data);
      this.userInfo.setValue({ ...result.data });
      this._headerServ.username.next(result.data.fullName);
      console.log(this.userInfo.value);
    });

    this._userServ.getUserImage().subscribe((img) => {
      this.userImage = img.profileImage;
      console.log(img.profileImage);
      this.imageSrc = `https://crafttttttwilllls.herokuapp.com${this.userImage}`;
      if (img.profileImage==='/uploads/defaultimage.png') {
        this.showRemoveButton=true;
      }
    });
  }
}