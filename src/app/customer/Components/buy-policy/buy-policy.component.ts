import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { CustomerService } from 'src/app/Services/customer.service';
import { NomineeDTO } from 'src/app/models/NomineeDTO';

import { Policy } from 'src/app/models/Policy';
import { Customer } from 'src/app/models/Customer';
import { ValidateForm } from 'src/app/helper/validateForm';
import { AdminService } from 'src/app/Services/admin.service';

@Component({
  selector: 'app-buy-policy',
  templateUrl: './buy-policy.component.html',
  styleUrls: ['./buy-policy.component.css']
})
export class BuyPolicyComponent implements OnInit{
 
  customerDetail:Customer=new Customer();
  policy:Policy=new Policy()
  firstNewName:string='';
  lastNewName:string='';
  NomineeForm!:FormGroup
  constructor(private customer: CustomerService,private location:Location,private fb:FormBuilder) {
    this.policy=this.customer.getPolicy()
    this.getSchemeDetail()
   
  }
  reqDocs:any
  schemeData:any
  documentForm!:FormGroup
  @ViewChild('fileInput')
  fileInput!: ElementRef;
  selectedFile!: File;
  ngOnInit(){
   this.getCustomerProfile()
   console.log(this.policy)
   this.NomineeForm=new FormGroup({
    nominee:new FormControl('',[Validators.required,ValidateForm.onlyCharactersValidator]),
    nomineeRelation:new FormControl('',[Validators.required,ValidateForm.onlyCharactersValidator])
   })
   this.documentForm = this.fb.group({});

   this.reqDocs.forEach((rdoc: any, index: number) => {
     this.documentForm.addControl(`fileInput${index}`, this.fb.control('', [Validators.required]));
   });
  }
  getSchemeDetail()
  {
    this.customer.getDetail(this.policy.insuranceSchemeId).subscribe(
      {
        next:(res)=>{
            this.schemeData=res;
            this.reqDocs=this.schemeData.requiredDocuments
            console.log(this.schemeData);
            console.log(this.reqDocs);
        },
        error:(err:HttpErrorResponse)=>{
          alert(err.message);
        }
      }
    )
  }
  getCustomerProfile()
  {
    this.customer.getCustomerProfile().subscribe({
      next:(response:any)=>{
        this.customerDetail=response
        console.log(this.customerDetail)
        this.firstNewName=response.customer?.['firstName']
        this.lastNewName=response.customer?.['lastName']
      },
      error:(err:HttpErrorResponse)=>{
        console.log(err)
      }
     })
  }

  addNominee()
  {
    alert('hi');
    if(this.NomineeForm.valid){
      alert('bye');
      this.policy.nominee=this.NomineeForm.get('nominee')?.value!
      this.policy.nomineeRelation=this.NomineeForm.get('nomineeRelation')?.value!

      alert("Added Successfully");
    }
    else{
      ValidateForm.validateAllFormFileds(this.NomineeForm)
      alert("One or more feilds are required");
    }
  }
 
 
addPolicy(){
  alert("Policy applied");
   this.applyPolicy()


}
applyPolicy()
{
  this.customer.purchasePolicy(this.policy).subscribe(
    {
      next:(res)=>{
        alert("Applied Successfully");
      },
      error:(err)=>{
        alert("Something went wrong!");
      }
    }
   )
}

goBack(){
  this.location.back()
}

}
