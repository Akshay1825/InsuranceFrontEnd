import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AdminService } from 'src/app/Services/admin.service';
import { CustomerService } from 'src/app/Services/customer.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-customer-policy',
  templateUrl: './customer-policy.component.html',
  styleUrls: ['./customer-policy.component.css']
})
export class CustomerPolicyComponent {
  isEmployee = false
  isAdmin = false
  isSearch=false
  jwtHelper = new JwtHelperService()
  currentPage = 1;
  totalPolicyCount = 0;
  policies: any;
  headers: any

  oldEmpObj: any
  pageSizes: number[] = [5, 10,15, 20,25, 30,35,40,45,50];

  pageSize = this.pageSizes[0];
  searchQuery: string | number = '';
  customerID!: number;
  constructor(private admin: AdminService, private location: Location, private customer: CustomerService, private activatedroute: ActivatedRoute) { }
  ngOnInit() {
    this.customerID = Number(this.activatedroute.snapshot.paramMap.get('id'));
    const decodedToken = this.jwtHelper.decodeToken(localStorage.getItem('token')!);
    const role: string = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if (role === 'EMPLOYEE') {
      this.isEmployee = true
    }
    else {
      this.isAdmin = true
    }
    this.getCustomerPolicies()

  }
  goBack(){
    this.location.back()
  }
  getCustomerPolicies() {
    this.admin.getFilterPolicies(this.customerID, this.currentPage, this.pageSize).subscribe({
      next: (response) => {

        const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);

        this.totalPolicyCount = paginationData.TotalCount;
        this.policies = response.body;
        //this.updatePaginatedEmployees();

      }
    })
  }
  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  get pageCount(): number {
    return Math.ceil(this.totalPolicyCount / this.pageSize);
  }



  changePage(page: number) {

    this.currentPage = page;
    this.getCustomerPolicies();
  }
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  onPageSizeChange(event: Event) {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getCustomerPolicies();
  }
  onSearch() {
    this.admin.getFilterPolicies(this.customerID, this.currentPage, this.pageSize, this.searchQuery).subscribe({
      next: (response) => {

        const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);

        this.totalPolicyCount = paginationData.TotalCount;
        this.policies = response.body;
        //this.updatePaginatedEmployees();

      }
    })
    this.isSearch=!this.isSearch
  }
  resetSearch(){
    this.searchQuery=''
    this.getCustomerPolicies()
    this.isSearch=false
  }
}
