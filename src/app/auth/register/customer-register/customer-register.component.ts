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
  fieldErrors = {
    username: '',
    email: '',
    mobileNumber: ''
  }

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
      birthDate: ['',[Validators.required,ValidateForm.minimumAge(18)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      confirmPassword: ['', Validators.required],
      address: ['', Validators.required]
    }, {
      validator: ValidateForm.confirmPasswordValidator('password', 'confirmPassword')
    }
    );
  }

  checkField(field: string): void {
    const userName = this.customerSignUpForm.get('userName')?.value || '';
    const email = this.customerSignUpForm.get('email')?.value || '';
    const mobileNumber = Number(this.customerSignUpForm.get('mobileNumber')?.value);
  
    // Debugging: Log values before calling the backend
    console.log('UserName:', userName, 'Email:', email, 'Mobile Number:', mobileNumber);
  
    this.auth.checkExistence(userName, email, mobileNumber).subscribe(
      (response) => {
        console.log('API Response:', response); 
        console.log(field == 'userName' && !userName);
        
        if (field == 'email') {
          this.fieldErrors.email = response.emailExists ? 'Email already exists.' : '';
        }
        if (field == 'userName') {
          this.fieldErrors.username = response.usernameExists ? 'Username already exists.' : '';
        }
        if (field == 'mobileNumber') {
          this.fieldErrors.mobileNumber = response.mobileExists ? 'Mobile number already exists.' : '';
        }
      },
      (error) => {
        console.log('Error:', error); // Log any errors from the backend
  
        if (error.status === 400) {
          // Check if the backend has returned specific errors for email, username, or mobile number
          const errorField = error.error.field;
          const errorMessage = error.error.message;
  
          if (errorField === 'userName') {
            this.fieldErrors.username = errorMessage;
          } else if (errorField === 'email') {
            this.fieldErrors.email = errorMessage;
          } else if (errorField === 'mobileNumber') {
            this.fieldErrors.mobileNumber = errorMessage;
          }
        }
      }
    );
  }
  

  customerSignUp() {
    if (this.customerSignUpForm.valid ) {
      if(this.fieldErrors.username)
        {
          alert('Username already exists.');
          return;
        }
      if(this.fieldErrors.email)
      {
        alert('Email already exists.');
        return;
      }
      if(this.fieldErrors.mobileNumber)
      {
        alert('Mobile number already exists.');
        return;
      }
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
