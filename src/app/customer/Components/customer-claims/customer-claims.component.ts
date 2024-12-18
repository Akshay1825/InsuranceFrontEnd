import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CustomerService } from 'src/app/Services/customer.service';
import { EmployeeService } from 'src/app/Services/employee.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

declare var window:any
@Component({
  selector: 'app-customer-claims',
  templateUrl: './customer-claims.component.html',
  styleUrls: ['./customer-claims.component.css']
})
export class CustomerClaimsComponent {
  isEmployee = false
  isAdmin = false
  jwtHelper = new JwtHelperService()
  currentPage = 1;
  totalCustomerCount = 0;
  claimData: any=[];
  headers: any;
  policyData: any={};
  toDate:any;
  fromDate:any;
  oldEmpObj: any
  pageSizes: number[] = [10, 20, 30];
  policyModal:any
  pageSize = this.pageSizes[0];
  searchQuery: string | number = '';
  constructor(private employee: EmployeeService,private router:Router,private location: Location, private customer: CustomerService) { }
  ngOnInit() {
    const decodedToken = this.jwtHelper.decodeToken(localStorage.getItem('token')!);
    const role: string = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if (role === 'EMPLOYEE') {
      this.isEmployee = true
    }
    else {
      this.isAdmin = true
    }
    this.getClaims()

    this.policyModal=new window.bootstrap.Modal(document.getElementById("policyDetailModal"));
  }
goBack(){
  this.location.back()
}
  getClaims() {
    this.employee.getClaims(this.currentPage, this.pageSize, this.fromDate,this.toDate).subscribe(
      (response) => {
        const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);
        this.claimData = response.body
        console.log(this.claimData)
        if (!Array.isArray(this.claimData) || this.claimData.length === 0) {
          alert("No Claims Found");
          this.goBack();
          return;
        }
        
      },
      (err) => {
        console.log(err.message);
        if (!Array.isArray(this.claimData) || this.claimData.length === 0) {
          alert("No Claims Found");
          this.goBack();
          return;
        }
        this.claimData = []
      }
    )
  }
  showPolicy(index:number){
  this.getPolicyData(index);
  this.policyModal.show()
  }
  getPolicyData(index: number) {
    console.log(this.claimData[index].policyId);
    this.customer.getPolicyDetail(this.claimData[index].policyId).subscribe({
      next: (response) => {
        this.policyData = response.body;
        console.log(this.policyData);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  get pageCount(): number {
    return Math.ceil(this.totalCustomerCount / this.pageSize);
  }



  changePage(page: number) {

    this.currentPage = page;
    this.getClaims()
  }
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  onPageSizeChange(event: Event) {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getClaims()
  }
  onSearch() {
    this.employee.getClaims(this.currentPage, this.pageSize, this.fromDate,this.toDate).subscribe(
      (response) => {
        const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);
        this.claimData = response.body
        console.log(this.claimData)
      },
      (err) => {
        console.log(err.message);
      }
    )
  }
  CheckDate(index: number) {
     this.getPolicyData(index);
    if(this.policyData.maturityDate.Date>this.claimData[index].claimDate.Date){
      return true;
    }
    else{
      return false
    }
   

  }
  updateClaim(index: number) {
    let claim = this.claimData[index];
    if(this.CheckDate(index))
    {
      claim.status = 0;
    }
    {
      claim.status = 2;
    }
   
    this.employee.updateClaims(claim).subscribe({
      next: (res) => {
        console.log("updated Successfully");
      
      },
      error: (err: HttpErrorResponse) => {
        alert("Something went wrong");
      }
    })
    this.getClaims();

  }
}
