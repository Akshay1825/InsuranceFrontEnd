import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { ValidateForm } from 'src/app/helper/validateForm';

@Component({
  selector: 'app-customer-register',
  templateUrl: './customer-register.component.html',
  styleUrls: ['./customer-register.component.css']
})
export class CustomerRegisterComponent {

  token: any = '';
  customerSignUpForm!: FormGroup
  customerObj: any;
  maxDate!: string;

  constructor(private auth: AuthService, private router: Router, private fb: FormBuilder) { 
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.customerSignUpForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3), ValidateForm.onlyCharactersValidator]],
      lastName: ['', [Validators.required, Validators.minLength(3), ValidateForm.onlyCharactersValidator]],
      userName: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      password: ['', [Validators.required, ValidateForm.passwordPatternValidator]],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['',[Validators.required]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      confirmPassword: ['', Validators.required],
      address: ['', Validators.required],
      // agentId: [null],
    }, {
      validator: ValidateForm.confirmPasswordValidator('password', 'confirmPassword')
    }
    );
  }
  customerSignUp() {
    if (this.customerSignUpForm.valid) {
      let formData = { ...this.customerSignUpForm.value };
      

      console.log(formData)
      this.auth.customerSignUp(formData).subscribe({
        next: (data) => {
          console.log(data)
          alert("Registered Successfully")
          this.router.navigateByUrl('/login')
        },
        error: (error: HttpErrorResponse) => {
          alert(error.message)
        }
      })
    }
    else {
      ValidateForm.validateAllFormFileds(this.customerSignUpForm);
      alert("One or more feilds required")
    }
  }



}
