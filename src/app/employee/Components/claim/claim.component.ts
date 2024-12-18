import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Location } from '@angular/common';
import { CustomerService } from 'src/app/Services/customer.service';
import { EmployeeService } from 'src/app/Services/employee.service';
declare var window:any
@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.css']
})
export class ClaimComponent {
  isEmployee = false
  isAdmin = false
  jwtHelper = new JwtHelperService()
  currentPage = 1;
  totalCustomerCount = 0;
  claimData: any=[];
  headers: any;
  policyData: any={};
  fromDate: any;
  toDate: any;

  oldEmpObj: any
  pageSizes: number[] = [5,10,15, 20,25, 30,35,40,45,50];
  policyModal:any
  pageSize = this.pageSizes[0];
  searchQuery: string | number = '';
  isSearch:boolean=false
  totalPages: any;
  constructor(private employee: EmployeeService,private http:HttpClient, private location: Location, private customer: CustomerService) { }
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
        this.totalPages = Math.ceil(paginationData.TotalCount / this.pageSize);
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

  updateClaim(i: number, status: number): void {
    this.claimData[i].status = status;
    this.http.put("https://localhost:7117/api/Claimm", this.claimData[i]).subscribe(
      (response) => {
        console.log('Claim updated successfully', response);
        this.getClaims();
      },
      (error) => {
        // Handle error response
        console.error('Error updating claim', error);
      }
    );
  }
  getPolicyData(index: number) {
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
    this.isSearch=!this.isSearch
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

  resetSearch(){
    this.toDate = '';
    this.fromDate = '';
    this.getClaims()
    this.isSearch=false
  
  }

  // onPageChange(page: number): void {
  //   if (page > 0 && page <= this.totalPages) {
  //     this.currentPage = page;
  //     this.loadClaims(); // Reload the claims data based on the new page
  //   }
  // }

  // // Page size change handler
  // onPageSizeChange(event: any): void {
  //   this.pageSize = event.target.value;
  //   this.loadClaims(); // Reload claims with the new page size
  // }
}
