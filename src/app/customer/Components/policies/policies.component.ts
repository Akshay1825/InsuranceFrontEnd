import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CustomerService } from 'src/app/Services/customer.service';
import { ValidateForm } from 'src/app/helper/validateForm';


declare var window:any
@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.css']
})
export class PoliciesComponent {


  customerData: any;
  searchQuery!: number
  currentPage = 1;
  totalPolicyCount = 0;
  policies: any;
  headers: any
  paginatedEmployees: any[] = [];
  pageSizes: number[] = [5, 10, 20, 30];
  policyToPay:any={}
  pageSize = this.pageSizes[0];
  paymentModal:any
  payPremiumForm!:FormGroup
  minDate: string;
  constructor(private customer: CustomerService, private router: Router,private location:Location ) { 
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }
  ngOnInit(): void {
    this.getCustomer();
    this.payPremiumForm=new FormGroup({
      paymentType:new FormControl('',[Validators.required]) ,
      cardHolderName:new FormControl('',[Validators.required,ValidateForm.onlyCharactersValidator]),
      cardNumber:new FormControl('',[Validators.required,Validators.pattern(/^\d{16}$/)]),
      cvv:new FormControl('',[Validators.required,Validators.pattern(/^\d{3}$/)]),
      expiryDate:new FormControl('',[Validators.required]),

    })

    this.getPolicies();
  
   
  }
  isSwitchOn: boolean = true;


  
  toggleSwitch(state: boolean) {
    this.isSwitchOn = state;
    this.getPolicies();
    
  }
 
 
  getPolicies() {
    let status = this.isSwitchOn ? 0 : 1; // Determine status based on the switch
    const userName = localStorage.getItem("userName");
  
    if (!userName) {
      console.error("User is not logged in.");
      alert("Please log in to access policies.");
      return;
    }
  
    // Fetch customer profile
    this.customer.getCustomerProfile().subscribe({
      next: (res) => {
        // if (!res || !res.customerId) {
        //   console.error("Customer profile is invalid or missing customerId.");
        //   alert("Failed to retrieve customer profile.");
        //   return;
        // }

        // const customerId = res.customerId;
  
        // Fetch policies using customerId
        this.customer.getPolicies(res.customer['customerId'], status, this.currentPage, this.pageSize).subscribe({
          next: (response) => {
            
            const paginationHeader = response.headers?.get('X-Pagination');
  
            if (paginationHeader) {
              try {
                const paginationData = JSON.parse(paginationHeader);
                console.log("Pagination data:", paginationData);
  
                this.totalPolicyCount = paginationData.TotalCount;
                this.currentPage = paginationData.CurrentPage;
                this.pageSize = paginationData.PageSize;
              } catch (error) {
                console.error("Error parsing X-Pagination header:", error);
                alert("Error processing pagination data.");
                return;
              }
            } else {
              console.warn("X-Pagination header is missing in the response.");
            }
  
            // Assign policies or fallback to an empty array
            this.policies = response.body || [];
            console.log("Policies:", this.policies);
          },
          error: (err: HttpErrorResponse) => {
            console.error("Error fetching policies:", err);
            this.policies = [];
            alert("Failed to fetch policies. Please try again.");
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error("Error fetching customer profile:", err);
        alert("Failed to retrieve customer profile. Please try again.");
      }
    });
  }
  
  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  
  get pageCount(): number {
    return Math.ceil(this.totalPolicyCount / this.pageSize);
  }



changePage(page: number) {

    this.currentPage = page;
    this.getPolicies();
  }
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  onPageSizeChange(event: Event) {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getPolicies();
  }
  onSearch() {
    let status = this.isSwitchOn ? 0 : 1
    this.customer.getPolicies(localStorage.getItem("userName")!, status, this.currentPage, this.pageSize, this.searchQuery).subscribe({
      next: (response) => {

        const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);

        this.totalPolicyCount = paginationData.TotalCount;
        this.policies = response.body;
        console.log(this.policies)
        //this.updatePaginatedEmployees();

      }
    })

  }
  viewPolicy(policy: any) {
    this.router.navigateByUrl('customer/Policies/' + policy.policyId);
  }
  checkDocumnetStatus(): boolean {
    if (this.customerData.documents == null)
      return false;
    else {
      let alltrue = true;

      for (let i = 0; i < this.customerData.documents.length; i++) {
        if (!this.customerData.documents[i].status){
          alltrue = false
          break;
        }
      }
      if (alltrue)
        return true;
      else
        return false;
    }
  }
  getCustomer() {

 this.customer.getCustomerProfile().subscribe({
  next:(res)=>{
    this.customerData=res;
  },
  error:(err:HttpErrorResponse)=>{
    console.log(err.message);
  }
 })

  }

  BuyPolicy(policy: any) {
 
    
    if (this.customerData != null) {
      if (this.checkDocumnetStatus()) {
       this.policyToPay=policy
    
       this.router.navigateByUrl("customer/policy/pay/"+policy.policyNo);
      }
      else {
        alert("Documents are not verified")
      }
    }
    else {
      alert("something went wrong")
    }
  }
goBack(){
  this.location.back()
}
}
