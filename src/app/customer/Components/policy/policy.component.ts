import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/Services/admin.service';
import { CustomerService } from 'src/app/Services/customer.service';
import { Claim } from 'src/app/models/Claim';
import { PaymentDTO } from 'src/app/models/PaymentDTO';
import { Location } from '@angular/common';
import { ValidateForm } from 'src/app/helper/validateForm';
import { TableModule } from 'primeng/table';
import { CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { SharedService } from 'src/app/Services/shared.service';
declare var Razorpay: any;

declare var window: any
@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})

export class PolicyComponent implements OnInit {
  static isClaimed:boolean=false
  policyId!: any
  policy: any
  data: any
  Tax: any = {}
  customerData: any=[]
  schemeData: any
  installment: any = [   { num: 1, isPaid: false },   { num: 2, isPaid: false } ];
  paymentModal: any
  claimModal: any
  schemeDeatil:any;
  PaymentForm!: FormGroup
  ClaimForm!: FormGroup
  installmentNo!: number
  minDate: string;
  NewAmount :any;
  NewBirthdate:any;
  NewProfitRatio :any;
  totalPremiumNumber: any;
  shivraj:any;
  Razorpay: any;
 
  
  constructor(private activatedroute: ActivatedRoute,private admin:AdminService,private sharedService:SharedService, private location:Location,private cd:ChangeDetectorRef, private customer: CustomerService, private fb: FormBuilder, private router: Router) 
  {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.getPolicyData();
   }
  ngOnInit() {
    this.policyId = (this.activatedroute.snapshot.paramMap.get('id'));
    this.getPolicyData();
    this.getTax();

    this.PaymentForm = this.fb.group({
      payType: ['', [Validators.required]],
      cHolderName: ['',[Validators.required,ValidateForm.onlyCharactersValidator]],
      cNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cvv: ['', [Validators.required,Validators.pattern(/^\d{3}$/)]],
      DateOfExpiry: ['', [Validators.required]],

    });
    this.ClaimForm = this.fb.group({
      bankAccountNo: ['', [Validators.required,Validators.pattern(/^\d{12}$/)]],
      bankIFSCCode: ['', [Validators.required]],

    });

  }
   
  resetPaymentForm()
  {
    this.PaymentForm.reset()
  }
  resetClaimForm(){
    this.ClaimForm.reset()
  }
 
  openModal(modal: any) {
    modal.show();
  }
  closeModal(modal: any) {
    modal.hide();
  }

  getPolicyData() {
    this.customer.getPolicyDetail(this.policyId).subscribe(
      (res: any) => {
        this.policy = res;
        this.data = this.policy.body;
        console.log(this.policy);
        console.log(this.installment);
        this.getCustomerDetail();
        this.getSchemeData();
        // this.sendData();
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    )
  }
  getCustomerDetail() {
    this.customer.getCustomerById(this.policy.body['customerId']).subscribe((res) => {
      this.customerData = res
      console.log(this.customerData)
    },
      (err: HttpErrorResponse) => {
        console.log(err);
      })
  }
  getSchemeData() {
    this.customer.getSchemeById(this.policy.body['insuranceSchemeId']).subscribe(
      (res) => {
        console.log(res);
        this.schemeData = res
         this.getSchemeDetail();
      },
      (err: HttpErrorResponse) => {
        console.log(err)
      }
    )
  }
  getSchemeDetail(){
   this.customer.getDetail(this.schemeData.body['schemeId']).subscribe({
    next:(res)=>{
      console.log(res);
      this.schemeDeatil=res;
      // this.cd.detectChanges();
    },
    error:(err)=>{
      console.log(err);
     
    }
   })
  }
  getTax() {
    console.log(this.installment);
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
  calculateTotalAmoutToPay() {
    return (((this.policy.body['premiumAmount'] * this.Tax.body[0].taxPercentage) / 100) + this.policy.body['premiumAmount'])
  }
  calculateDueDate(emi: number) {
    
    let issueDate = this.policy.body['issueDate'];
    let emiMode: number = this.policy.body['premiumType'];
    const parsedIssueDate = new Date(issueDate);
    const dueDate = new Date(parsedIssueDate);

    if (emiMode == (3)) {
      dueDate.setMonth(dueDate.getMonth() + (1 * emi));
    } else if (emiMode == 2) {
      dueDate.setMonth(dueDate.getMonth() + (3 * emi));
    } else if (emiMode == 1) {
      dueDate.setMonth(dueDate.getMonth() + (6 * emi));
    }
    else {
      dueDate.setMonth(dueDate.getMonth() + (12 * emi));
    }
    return dueDate;
  }
  // showPaymentModal(index: any) {
    // this.PayPremium();
    // this.router.navigateByUrl("customer/policy/pay/" + this.policy.body['policyId']);
  // }

  // sendData() {
  //   const object1 = this.customerData;
  //   const object2 = this.schemeData;
  //   const object3 = this.policy;
  //   const object4 = this.Tax;
  //   this.router.navigateByUrl('sample', {
  //     state: { obj1: object1, obj2: object2 , obj3: object3, obj4: object4},
  //   })
  // }
  showPremiums()
  {
    this.router.navigateByUrl('sample/' + this.policy.body['policyId'])
  }
  PayPremium()
  {
    const options = {
      key: 'rzp_test_RB0WElnRLezVJ5', 
      amount: this.calculateTotalAmoutToPay()*100,
      currency: 'INR',
      name: 'NewInsurance',
      description: 'Test Payment',
      image: 'https://your-logo-url.com/logo.png', // Optional logo
      handler: (response: any) => {
        // This handler will be called when the payment is successful
        alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
        console.log(response);
        console.log(response.razorpay_order_id);
      },
      prefill: {
        name: this.customerData.body['firstName']+ this.customerData.body['lastName'],
        email: this.customerData.body['email'],
        contact: this.customerData.body['mobileNumber'],
      },
      notes: {
        address: this.customerData.body['address'],
      },
      theme: {
        color: '#F37254'
      }
    };

    // Open Razorpay checkout
    const rzp1 = new Razorpay(options);
    rzp1.open();
  }
  // PayPremium() {

  //   debugger
  //   if(this.PaymentForm.valid){
  //   let payment = new PaymentDTO();
  //   payment.amount = this.policy.premium,
  //     payment.totalPayment = this.calculateTotalAmoutToPay(),
  //     payment.cvvNo = String(this.PaymentForm.get('cvv')?.value!),
  //     payment.cardHolderName = this.PaymentForm.get('cHolderName')?.value!,
  //     payment.cardNumber = String(this.PaymentForm.get('cNumber')?.value!),
  //     payment.expiryDate = this.PaymentForm.get('DateOfExpiry')?.value!,
  //     payment.paymentType = parseInt(this.PaymentForm.get('payType')?.value!)
  //   payment.tax = (this.policy.premium * this.Tax.taxPercent) * 0.01
  //   payment.policyNumber = this.policy.policyNo
  //   console.log(payment)
  //   this.customer.makePayment(payment).subscribe({
  //     next: (res) => {
  //       alert("Paid Successfully");
  //       this.installment[this.installmentNo].isPaid = true;
  //       this.closeModal(this.paymentModal);
  //       location.reload()
  //     },
  //     error: (err: HttpErrorResponse) => {
  //       alert("Something went wrong");
  //       console.log(err)
  //       this.closeModal(this.paymentModal);
  //     }
  //   })
  // }
  // else{
  //   ValidateForm.validateAllFormFileds(this.PaymentForm);
  //   alert("one or more field are required");
  // }

  // }
  downloadReceipt(index: number) {
    console.log(index)
    console.log(this.policy.payments[index])
    this.router.navigateByUrl("/payment/receipt/" + this.policy.payments[index].paymentId)

  }
  claim() {
    this.claimModal = new window.bootstrap.Modal(document.getElementById("claimPolicyModal"));
    this.openModal(this.claimModal);
  }
  claimPolicy() {
    console.log(this.ClaimForm.value);
  
    // Check form validity
    if (this.ClaimForm.valid) {
      // Prepare claim data
      const claim = {
        bankAccountNo: this.ClaimForm.get('bankAccountNo')?.value,
        bankIFSCCode: this.ClaimForm.get('bankIFSCCode')?.value,
        claimAmount: this.data.sumAssured,
        policyNumber: this.data.policyNumber,
        policyId: this.data.policyId,
        claimDate: new Date()
      };
  
      console.log(claim);
  
      // Register claim
      this.customer.registerCliam(claim).subscribe({
        next: (res) => {
          alert("Claim registered successfully.");
          console.log(res);
  
          // Mark policy as claimed
          PolicyComponent.isClaimed = true;
  
          // Close the modal
          this.closeModal(this.claimModal);
  
          // Update the policy
          this.admin.UpdatePolicy(this.data).subscribe({
            next: (updateRes) => {
              console.log('Policy updated successfully', updateRes);
              alert('Policy updated successfully!');
              location.reload();
            },
            error: (error) => {
              console.error('Error while updating the policy:', error);
              alert('An error occurred while updating the policy. Please try again later.');
            },
          });
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error while registering the claim:', err);
          alert("Something went wrong while registering the claim.");
          this.closeModal(this.claimModal);
        },
      });
    } else {
      // Handle invalid form
      alert("One or more required fields are missing.");
      ValidateForm.validateAllFormFileds(this.ClaimForm);
    }
  }
  goBack(){
    this.location.back();
  }
}
