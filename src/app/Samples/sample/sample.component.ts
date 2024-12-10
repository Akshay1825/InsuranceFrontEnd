import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/Services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from 'src/app/Services/customer.service';
import { AdminService } from 'src/app/Services/admin.service';
import { HttpErrorResponse } from '@angular/common/http';
declare var Razorpay:any

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.css'],
})
export class SampleComponent implements OnInit {
  
  policyId: any;
  policy: any;
  customerData: any;
  schemeData: any;
  installment: any;
  Tax:any;
  minDate: string;
  Razorpay: any;
  newForm: any;
  newDate:any;
  newPolicyForm:any;

  constructor(private router:Router,private route: ActivatedRoute,private customer:CustomerService,private admin:AdminService) 
  { 
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.policyId = this.route.snapshot.paramMap.get('policyId');
    this.getPolicyData();
    this.newDate = new Date();
    
  }

  getPolicyData() {
    this.customer.getPolicyDetail(this.policyId).subscribe(
      (res: any) => {
        this.policy = res;
        // alert(this.policy.payments.length)
        console.log(this.policy);
        this.getCustomerDetail();
        this.getSchemeData();
        this.getTax();
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
        this.schemeData = res;
        this.installment = Array.from(
          { length: this.policy.body['totalPremiumNumber'] },
          (_, i) => ({ number: i + 1, isPaid: false })
        );
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

  isToday(dateString: any): boolean {
    const dbDate = new Date(dateString);
    const today = new Date(); 
    return (
      dbDate.getFullYear() === today.getFullYear() &&
      dbDate.getMonth() === today.getMonth()
    );
  }

  CalculateAmount() {
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

  PayPremium(id: number)
  {
    const options = {
      key: 'rzp_test_RB0WElnRLezVJ5', 
      amount: Math.round(this.CalculateAmount()*100),
      currency: 'INR',
      name: 'NewInsurance',
      description: 'Test Payment',
      image: 'https://your-logo-url.com/logo.png', // Optional logo
      handler: (response: any) => {
        // This handler will be called when the payment is successful
        alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
        console.log(response);
        this.UpdatePayment(id);
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
    const rzp1 = new Razorpay(options);
    rzp1.open();
  }

  downloadReceipt(index: any) {
    console.log(index)
    this.router.navigateByUrl("/payment/receipt/" + index + "/" + this.policy.body['policyId'])
  }

  UpdatePayment(indexId:number)
  {
    const paymentData = {
      policyId: this.policy.body['policyId'], // Ensure the policy object is defined
      indexId: indexId,                      // Replace indexId with your actual index value
      status: "Paid",
      tax: this.Tax.body[0].taxPercentage,   // Ensure Tax object is defined
      amount: this.CalculateAmount(),        // Assuming CalculateAmount() returns the correct amount
      paymentDate: new Date().toISOString()  // ISO format date string
    };

console.log([paymentData]); // Debugging: Log FormData content

// Send the FormData
this.admin.UpdatePayment(paymentData).subscribe(
  (res: any) => {
    if (res) {
      console.log(res);
      console.log('Payment updated successfully');
      alert('Payment updated successfully!');
      this.UpdatePolicy(); // Call update policy
    } else {
      console.error('Payment update failed:', res.message);
      alert('Payment update failed: ' + res.message);
    }
  },
  (error) => {
    console.error('An error occurred while updating payment:', error);
    alert('An error occurred while updating payment. Please try again later.');
  }
);
  }

  UpdatePolicy()
  {
    const updatedPolicy = {
      policyId: this.policy.body['policyId'],
      policyNumber: this.policy.body['policyNumber'],
      policyTerm: this.policy.body['policyTerm'],
      premiumAmount: this.policy.body['premiumAmount'],
      premiumType: this.policy.body['premiumType'],
      schemeName: this.policy.body['schemeName'],
      status: this.policy.body['status'],
      sumAssured: this.policy.body['sumAssured'],
      totalPremiumNumber: this.policy.body['totalPremiumNumber'],
      customerId: this.policy.body['customerId'],
      insuranceSchemeId: this.policy.body['insuranceSchemeId'],
      investmentAmount: this.policy.body['investmentAmount'],
      issueDate: this.policy.body['issueDate'],
      maturityDate: this.policy.body['maturityDate'],
      nominee: this.policy.body['nominee'],
      nomineeRelation: this.policy.body['nomineeRelation'],
    };
    
    // Call the service to update the policy
    this.admin.UpdatePolicy(updatedPolicy).subscribe(
      (res: any) => {
        if (res) {
          // If the response indicates success, update the local state or UI
          console.log('Policy updated successfully');
          alert('Policy updated successfully!');
    
          // Optionally, you can navigate to another page or refresh data
          // this.router.navigate(['/policies']); // Uncomment to navigate to policies page
        } else {
          // If the update fails, handle the failure
          console.error('Policy update failed:', res.message);
          alert('Policy update failed: ' + res.message);
        }
      },
      (error) => {
        // Handle any errors during the request
        console.error('An error occurred while updating the policy:', error);
        alert('An error occurred while updating the policy. Please try again later.');
      }
    );
  }
}

