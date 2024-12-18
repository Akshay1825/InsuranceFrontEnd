import { FormControl, FormGroup, ValidationErrors } from "@angular/forms";
import { AbstractControl, ValidatorFn } from '@angular/forms';
export class ValidateForm {

  static validateAllFormFileds(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control?.markAsDirty({ onlySelf: true });
      }
      else if (control instanceof FormGroup) {
        this.validateAllFormFileds(control)
      }

    });
  }

  static integer(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null;
    return Number.isInteger(Number(value)) ? null : { notInteger: true };
  }
  minMaxValidator(minField: string, maxField: string) {
    return (formGroup: FormGroup): { [key: string]: boolean } | null => {
      const minControl = formGroup.get(minField);
      const maxControl = formGroup.get(maxField);
  
      if (minControl && maxControl && minControl.value >= maxControl.value) {
        return { [`${minField}GreaterThanMax`]: true };
      }
      return null;
    };
  }
  static onlyCharactersValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;

    // Regular Expression Explanation:
    // ^[a-zA-Z\s]*$ - Ensures only letters (a-z, A-Z) and spaces (\s) are allowed.
    const regex = /^[a-zA-Z\s]*$/;

    if (value && !regex.test(value)) {
      return { onlyCharacters: true }; // Validation fails
    }

    return null; // Validation passes
  }


  

  static passwordPatternValidator(control: FormControl): { [key: string]: any } | null {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+=-])(?=.{8,})/;
  
    if (!regex.test(control.value)) {
      return {
        passwordValidator: {
          message: ` *Password must contain at least 8 characters<br>
           *one uppercase letter<br>*one lowercase letter<br>
           *one number<br>*one special character.`
        },
      };
    }
  
    return null;
  }

 

 static confirmPasswordValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: AbstractControl) => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);
  
      if (control?.value !== matchingControl?.value) {
        matchingControl?.setErrors({ confirmPassword: true });
      } else {
        matchingControl?.setErrors(null);
      }
  
      return null;
    };
  }
  static minimumAge(minimumAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value) {
        const birthDate = new Date(control.value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();

        // Adjust age if the birthday hasn't occurred yet this year
        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        // If age is less than the required minimum, return an error
        if (age < minimumAge) {
          return { ageTooYoung: true };
        }
      }
      return null; // Return null if validation passes
    };
  }

 static  rangeValidator(min: number, max: number): any {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;

    if (value < min || value > max) {
      return { 'rangeError': { min, max } };
    }

    return null;
  };
}

}