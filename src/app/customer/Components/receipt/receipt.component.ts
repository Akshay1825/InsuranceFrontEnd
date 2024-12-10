import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { error } from 'jquery';
import { CustomerService } from 'src/app/Services/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent {
  paymentData:any={}
  customerData:any={}
  policyData:any={}
  schemeData:any={}
  index!:number;
  policyId:any;
  policy!:any;
  Tax:any;
  taxAmount:any;

constructor(private customer:CustomerService,private route:ActivatedRoute){}

 ngOnInit(){
  this.route.params.subscribe(params => {
    this.index = +params['index']; // '+' is used to convert the string to a number
    this.policyId = params['policyId'];
    console.log('Index:', this.index);
    console.log('PolicyId:', this.policyId);
  });
  this.getPolicyData();
 }

 getPolicyData() {
  this.customer.getPolicyDetail(this.policyId).subscribe(
    (res: any) => {
      this.policy = res;
      // alert(this.policy.payments.length)
      console.log(this.policy);
      this.getCustomerDetail();
      this.getPaymentDetails();
      // this.getSchemeData();
      this.getTax();
    },
    (err: HttpErrorResponse) => {
      console.log(err);
    }
  )
}
 getCustomerDetail() {
  this.customer.getCustomerProfile().subscribe((res) => {
    this.customerData = res
    console.log(this.customerData)
  },
    (err: HttpErrorResponse) => {
      console.log(err);
    })
}

getPaymentDetails(){
this.customer.getPaymentById(this.index,this.policyId).subscribe(
  {
    next:(res)=>{
      this.paymentData=res;
      this.getSchemeData();
    },
    error:(err)=>{
     console.log(err.message);
    }
  }
)
}

getSchemeData() {
  this.customer.getSchemeById(this.policy.body['insuranceSchemeId']).subscribe(
    (res) => {
      console.log(res);
      this.schemeData = res;
    },
    (err: HttpErrorResponse) => {
      console.log(err)
    }
  )
}

getTax() {
  this.customer.getTaxPercent().subscribe({
    next: (res) => {
      this.Tax = res;
      console.log(this.Tax.body[0].taxPercentage)
    },
    error: (err: HttpErrorResponse) => {
      console.log(err.message);
    }
  })
}
calculateTax(){
return this.taxAmount = this.paymentData.body['amount'] - this.policy.body['premiumAmount'];
}
// getSchemeData(id:any){
//   this.customer.getSchemeById(id).subscribe(
//     {
//       next:(res)=>{
//         this.schemeData=res
//       },
//       error:(err:HttpErrorResponse)=>{
//         console.log(err);
//       }
//     }
//   )
// }
// }
}
