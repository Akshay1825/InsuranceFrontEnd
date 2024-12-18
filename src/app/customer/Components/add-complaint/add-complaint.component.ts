import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/Services/customer.service';
import { ValidateForm } from 'src/app/helper/validateForm';
import { Complaint } from 'src/app/models/Complaint';
import { Location } from '@angular/common';
@Component({
  selector: 'app-add-complaint',
  templateUrl: './add-complaint.component.html',
  styleUrls: ['./add-complaint.component.css']
})
export class AddComplaintComponent {
addComplaintForm!:FormGroup
customerProfile:any;
response:any;
complaint:Complaint=new Complaint()
constructor(private customer:CustomerService, private location:Location){}
ngOnInit(){
this.addComplaintForm=new FormGroup({
  complaintName:new FormControl('',[Validators.required,ValidateForm.onlyCharactersValidator]),
  complaintMessage:new FormControl('',[Validators.required])
})
this.getCustomerProfle();
}
goBack():void{
  this.location.back();
}
getCustomerProfle() {
  this.customer.getCustomerProfile().subscribe({
    next: (res: any) => {
      this.customerProfile = res;
      console.log(this.customerProfile)
    },
    error: (err: HttpErrorResponse) => {
      console.log(err)
    }

  })
}
addComplaint(){
if(this.addComplaintForm.valid){
 this.complaint.complaintName=this.addComplaintForm.get('complaintName')!.value;
 this.complaint.complaintMessage=this.addComplaintForm.get('complaintMessage')!.value;
 this.complaint.customerId=this.customerProfile.customer['customerId'];
 this.complaint.status = true;
 this.complaint.dateOfComplaint = new Date();


  this.customer.addComplaint(this.complaint).subscribe({
    next:(res:any)=>{
      console.log(res);
       alert("Complaint Registered Successfully");
       this.addComplaintForm.reset();
       this.goBack();
    },
    error:(err:HttpErrorResponse)=>{
      alert("Something went wrong!")
    }
  })
}
else{
  ValidateForm.validateAllFormFileds(this.addComplaintForm)
  alert("Please Enter All Details Correctly");
  
}
}

}
