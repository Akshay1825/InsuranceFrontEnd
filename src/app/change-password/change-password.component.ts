import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../Services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidateForm } from '../helper/validateForm';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  changePasswordForm=new FormGroup({
    userName:new FormControl('',Validators['required']),
    password:new FormControl('',Validators['required']),
    newPassword:new FormControl('',[Validators.required,ValidateForm.passwordPatternValidator])
  });
  jwtHelper = new JwtHelperService();
  newRole:string ='';
  
  constructor(private auth:AuthService,private router:Router,private location:Location){}
  isAdmin=false
  isCustomer=false
  isAgent=false
  isEmployee=false
  ngOnInit(){
    const decodedToken = this.jwtHelper.decodeToken(localStorage.getItem('token')!);
    const role: string = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    this.newRole=role;
    if(role==='CUSTOMER')
    {
      this.isCustomer=true
    }
    else if(role==='ADMIN')
    {this.isAdmin=true}
    else if(role==='AGENT')
    {
      this.isAgent=true
    }
    else{
      this.isEmployee=true
    }
    
  }
  updatePassword(){
  if(this.changePasswordForm.valid){
    var OldPassword=localStorage.getItem('password')
    this.auth.changePassword(this.changePasswordForm.value, this.newRole).subscribe({
      next: (res) => {
        console.log(res);
        alert("Password updated successfully.");
        this.auth.logOut();
        this.router.navigateByUrl('/');
      },
      error: (err: HttpErrorResponse) => {
        console.error("Error occurred:", err);
        if (err.status === 401) {
          alert("Unauthorized: Incorrect username or password.");
        } else {
          alert("Something went wrong. Please try again later.");
        }
      },
    });

  }
}
  goBack(){
    this.location.back();
  }
}
