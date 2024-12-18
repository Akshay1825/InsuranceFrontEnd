import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { CustomerService } from 'src/app/Services/customer.service';


@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.css']
})
export class CustomerProfileComponent {
  customerProfile2: any;
constructor(private customer:CustomerService,private location:Location){}
customerProfile!:any
isEdit:boolean=false
profileUpdateForm!:FormGroup
ngOnInit(){
this.getProfile();
this.profileUpdateForm=new FormGroup(
  {
    
  }
)
}
 getProfile(){
  
  this.customer.getCustomerProfile().subscribe({
    next:(res)=>{
      this.customerProfile=res
      this.customerProfile2 = res.customer
      console.log(this.customerProfile2);
      console.log(res);
    },
    error:(err)=>{
      console.log(err)
    }
  })
 }
 onEdit(){
this.isEdit=true

 }
 updateProfile(){
  if(this.validateForm(this.customerProfile))
  {
   console.log(this.customerProfile.customer)
  
   this.customer.updateCustomer(this.customerProfile.customer).subscribe({
    next:(res)=>{
      alert("Updated Successfully")
      location.reload();
    },
    error:(err:HttpErrorResponse)=>{
      console.log(err)
      alert(err.message)
    }
   })
  }
  
this.isEdit=false
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
 ValidateField(item:any){
  if(item!=='')
  return false;
 else
  return true

 }
 validateForm(obj:any)
 {
  if((!this.ValidateField(obj.mobileNumber)&&!this.validatePhone(obj.mobileNumber))||(!this.ValidateField(obj.email)&&!this.validateEmail(obj.email))||(!this.ValidateField(obj.address))){
return true
  }
  return false
 }
 OnCancel(){
  this.getProfile()
  this.isEdit=false
 }
 goBack(){
  this.location.back()
 }
}
