import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";
import {BehaviorSubject} from "rxjs";

export function wrongCredentialsValidator(loginStatus$: BehaviorSubject<boolean>): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return !loginStatus$.value ? {wrongCredentials: {value: control.value}} : null;
  };
}
