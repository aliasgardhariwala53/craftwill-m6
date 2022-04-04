import { FormGroup, ValidatorFn, AbstractControl ,ValidationErrors} from '@angular/forms';
import {ToastrService}  from 'src/app/shared/services/toastr.service';
import { ToastrService as toast } from "ngx-toastr";
export const valueChanges = (form: FormGroup, formErrors, errorMessages): any => {
    if (!form) { return; }
    for (const field in formErrors) {
      if (formErrors.hasOwnProperty(field)) {
        formErrors[field] = '';
        const control = form.get(field);
        if (control && (control.dirty || control.touched) && !control.valid) {
          const messages = errorMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
    return formErrors;
};


export class passwordValidation {
  static match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (checkControl.errors && !checkControl.errors['matching']) {
        return null;
      }

      if (control.value !== checkControl.value) {
        controls.get(checkControlName).setErrors({ matching: true });
        return { matching: true };
      } else {
        return null;
      }
    }
  }
};
export class passwordValidationNotMatch {
  static Notmatch(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (checkControl.errors && !checkControl.errors['Notmatching']) {
        return null;
      }

      if (control.value === checkControl.value) {
        controls.get(checkControlName).setErrors({ Notmatching: true });
        return { Notmatching: true };
      } else {
        return null;
      }
    }
  }
};

export const errorHandler = (error) => {
  //console.log(error.message);
  let message =''
  if (error.status === 403) {
    message = error?.message || 'Request denied';
  } else if (error.status === 404) {
    message = error?.message || 'Not Found';
  } else if (error.status === 500) {
    message = error?.message || 'Server error!';
  } else if (error.status === 400) {
    message = error?.message || 'Please try again.';
  } else if (error.status === 401) {
    message = error?.message || 'Unauthenticated';
  }
   else if (error.status === 503) {
    message = error?.message || 'Server error, try after some time.';
  }
  else {
    message = error?.message || 'Something went wrong!'
  }
  return message;
};



export class CustomValidators {
  static patternValidator(controlName: string,regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (controls: AbstractControl): { [key: string]: any } => {
      const control = controls.get(controlName);

      if (!regex.test(control.value)) {
        //console.log(regex);
        
        controls.get(controlName).setErrors(error);
        return error;
      } else {
        return null;
      }
      // if (!control.value) {
      //   // if control is empty return no error
      //   return null;
      // }

      // // test the value of the control against the regexp supplied
      // const valid = regex.test(control.value);

      // // if true, return no error (no error), else return error passed in the second parameter
      // return valid ? null : error;
    };
  }

  static passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value; // get password from our password form control
    const confirmPassword: string = control.get('confirmPassword').value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('confirmPassword').setErrors({ NoPassswordMatch: true });
    }
  }
}