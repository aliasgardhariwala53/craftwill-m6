import { FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';

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