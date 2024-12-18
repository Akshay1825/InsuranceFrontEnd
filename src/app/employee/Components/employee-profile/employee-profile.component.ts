import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/Services/employee.service';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent {

  employeeProfile:any
  employeeData:any
  isEdit:boolean=false
  constructor(private employee:EmployeeService){}
 ngOnInit(){
 this.getEmployeeProfile();
 }
 validateEmail(item:any){
  const regexPattern=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if(regexPattern.test(item))
   return false;
  return true
 }
 validatePhone(item:any){
  const regexPattern=/^\d{10}$/;
  if(regexPattern.test(item))
  return false
return true
 }
 validateField(item:any){
  if(item!=='')
  return false;
 else
  return true

 }
 validateForm(obj:any)
 {
  console.log(obj);
  if((!this.validateField(obj.mobileNumber)&&!this.validatePhone(obj.mobileNumber))||(!this.validateField(obj.email)&&!this.validateEmail(obj.email))){
return true
  }
  return false
 }
 getEmployeeProfile(){

  this.employee.getProfile().subscribe({
    next:(res)=>{
      this.employeeProfile=res;
      console.log(this.employeeProfile);
    },
    error:(err:HttpErrorResponse)=>{
      console.log(err.message);
    }
  })
 }
 onEdit(){
  this.isEdit=true
 }
 updateProfile()
 {
  console.log(this.employeeProfile)
  if(this.validateForm(this.employeeProfile.body.customer)){
   this.employee.updateEmployee(this.employeeProfile.body.customer).subscribe({
    next:(res)=>{
   
      alert("Updated Successfully");
      location.reload()
     
    },
    error:(err:HttpErrorResponse)=>{
      alert("Invalid Details");
    }
   })
  }
  else{
    alert("Invalid Details! Try Again");
  }

 }
 OnCancel(){
  this.isEdit=false
  this.getEmployeeProfile()
 }
}
