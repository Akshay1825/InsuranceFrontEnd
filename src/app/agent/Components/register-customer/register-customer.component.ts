import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { AgentService } from 'src/app/Services/agent.service';
import { AuthService } from 'src/app/Services/auth.service';
import { ValidateForm } from 'src/app/helper/validateForm';

@Component({
  selector: 'app-register-customer',
  templateUrl: './register-customer.component.html',
  styleUrls: ['./register-customer.component.css']
})
export class RegisterCustomerComponent implements OnInit {
  token: any = '';
  customerSignUpForm!: any;
  customerObj: any;
  agentProfile: any={};
  maxDate!: string; 
  constructor(private auth: AuthService, private location:Location, private fb: FormBuilder,private agent:AgentService) {
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0];
   }

  ngOnInit() {
    this.customerSignUpForm = this.fb.group({
      firstName: ['', [Validators.required,Validators.minLength(3),ValidateForm.onlyCharactersValidator]],
      lastName: ['', [Validators.required,Validators.minLength(3),ValidateForm.onlyCharactersValidator]],
      userName: ['', [Validators.required,Validators.minLength(6),Validators.maxLength(20)]],
      password: ['', [Validators.required,ValidateForm.passwordPatternValidator]],
      email: ['', [Validators.required,Validators.email]],
      birthDate:['',[Validators.required]],
      mobileNumber: ['', [Validators.required,Validators.pattern(/^[0-9]{10}$/)]],
      confirmPassword: ['', Validators.required],
      address:['',Validators.required],
      agentId:[''],
    },{
      validator: ValidateForm.confirmPasswordValidator('password', 'confirmPassword')
    }
    );

   this.getAgentProfile();
  }
  getAgentProfile(){
    this.agent.getProfile().subscribe({
      next:(res)=>{
        this.agentProfile=res;
        
        console.log(this.agentProfile);
        console.log(this.agentProfile.body.customer['id']);
      },
      error:(err:HttpErrorResponse)=>{
        console.log(err.message);
      }
    })
  }
 customerSignUp() {
   
    if (this.customerSignUpForm.valid) {
      
      this.customerSignUpForm.get('agentId')?.setValue(this.agentProfile.body.customer['id']);
      let formData={ ...this.customerSignUpForm.value };
      
      console.log(formData)
      this.auth.customerSignUp(formData).subscribe({
        next: (data) => {
          console.log(data)
          this.customerSignUpForm.reset();
          alert("Registered Successfully")
         
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
  goBack():void{
    this.location.back();
  }

}
