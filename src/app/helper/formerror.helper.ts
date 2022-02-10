import { FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
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
  console.log(error.message);
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