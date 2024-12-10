import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from 'src/app/Services/customer.service';
import { ValidateForm } from 'src/app/helper/validateForm';
import { PaymentDTO } from 'src/app/models/PaymentDTO';
import { Location } from '@angular/common';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  policyId!: any;

  payPremiumForm!:FormGroup;
  minDate: string;
  policyToPay: any={};
  Tax: any;
  constructor(private customer: CustomerService ,private location:Location,private activatedroute:ActivatedRoute)
  {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }
  ngOnInit(){
    this.policyId = this.activatedroute.snapshot.paramMap.get('id');
    this.getPolicyDetail()
    this.getTax()

  this.payPremiumForm=new FormGroup({
    paymentType:new FormControl('',[Validators.required]) ,
    cardHolderName:new FormControl('',[Validators.required,ValidateForm.onlyCharactersValidator]),
    cardNumber:new FormControl('',[Validators.required,Validators.pattern(/^\d{16}$/)]),
    cvv:new FormControl('',[Validators.required,Validators.pattern(/^\d{3}$/)]),
    expiryDate:new FormControl('',[Validators.required]),

  })
}
getTax(){
  this.customer.getTaxPercent().subscribe({
    next:(res)=>{
      this.Tax=res;
      console.log(res)
    },
    error:(err:HttpErrorResponse)=>{
      console.log(err.message);
    }
  })
}
getPolicyDetail()
{
  alert(this.policyId);
  this.customer.getPolicyDetail(this.policyId).subscribe(
    (res: any) => {
      this.policyToPay = res;
      console.log(this.policyToPay)
      console.log(this.policyToPay.payments.length)
    },
    (err: HttpErrorResponse) => {
      console.log(err);
    }
  )

}
calculateTotalAmoutToPay(){
  return (((this.policyToPay.premium*this.Tax.taxPercent)/100) +this.policyToPay.premium)
 }
 resetForm() {
this.payPremiumForm.reset()
  }
PayPremium(){
  if(this.payPremiumForm.valid){
let payment=new PaymentDTO();
payment.amount=this.policyToPay.premium,
payment.totalPayment=this.calculateTotalAmoutToPay(),
payment.cvvNo=String(this.payPremiumForm.get('cvv')?.value!),
payment.cardHolderName=this.payPremiumForm.get('cardHolderName')?.value!,
payment.cardNumber=String(this.payPremiumForm.get('cardNumber')?.value!),
payment.expiryDate=this.payPremiumForm.get('expiryDate')?.value!,
payment.paymentType=parseInt(this.payPremiumForm.get('paymentType')?.value!)
payment.tax=(this.policyToPay.premium*this.Tax.taxPercent)*0.01
payment.policyNumber=this.policyToPay.policyNo
console.log(payment)
this.customer.makePayment(payment).subscribe({
  next:(res)=>{
    alert("Paid Successfully");
  
   // this.updatePolicy();
  this.payPremiumForm.reset();
  this.goBack()
  },
  error:(err:HttpErrorResponse)=>{
    alert("Something went wrong");
    console.log(err)
   
  }
})
}
else{
alert("one or more fields are required")
ValidateForm.validateAllFormFileds(this.payPremiumForm)
}

}
 goBack(){
    this.location.back();
  }
}
