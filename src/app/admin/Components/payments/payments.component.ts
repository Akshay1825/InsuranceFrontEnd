import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AdminService } from 'src/app/Services/admin.service';
import { CustomerService } from 'src/app/Services/customer.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent {

  fromDate: string = '';    // For From Date
  toDate: string = '';
  currentPage = 1;
  totalPaymentCount = 0;
  payments: any
  headers: any
  paginatedEmployees: any[] = [];
  oldEmpObj: any
  pageSizes: number[] = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
  policyData: any = {}
  customerData: any = {}
  pageSize = this.pageSizes[0];
  serachQuery?: number;
  todayDate: Date = new Date();
  isSearch:boolean=false

  constructor(private admin: AdminService, private customer: CustomerService,private location:Location) {

  }
  ngOnInit() {
    this.todayDate.setDate(this.todayDate.getDate() - 1);
    this.getPayments()
  }

  getPayments() {
    this.admin.getPayments(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);

        this.totalPaymentCount = paginationData.TotalCount;
        this.payments = response.body

      },
      error: (err) => {
        console.log(err);
        this.payments =[]
      }
    })
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  get pageCount(): number {
    return Math.ceil(this.totalPaymentCount / this.pageSize);
  }
  changePage(page: number) {

    this.currentPage = page;
    this.getPayments();
  }

  roundToTwoDecimals(value: number): number {
    if (isNaN(value)) return 0;
    return Math.round(value * 100) / 100;
  }
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  onPageSizeChange(event: Event) {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getPayments();
  }
  updatePaginatedEmployees() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedEmployees = this.payments.slice(start, end);
  }
  onSearch() {
    this.admin.getPayments(this.currentPage, this.pageSize, this.fromDate, this.toDate, this.serachQuery).subscribe({
      next: (response) => {
        const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);
  
        this.totalPaymentCount = paginationData.TotalCount;
        this.payments = response.body;
      },
      error: (err) => {
        console.log(err);
        this.payments = [];
      }
    });
    this.isSearch = !this.isSearch;
  }
  viewDetail(payment: any) {
    console.log(payment);
    this.customer.getPolicyDetail(payment.policyId).subscribe(
      {
        next: (res) => {
          this.getCustomerDetail(res.body.customerId);
          this.policyData = res.body;
          console.log(this.policyData);
        },
        error: (err) => {
          console.log(err)
        }
      }
    )
    // this.getCustomerDetail(this.policyData.body.customerId);
  }
  getCustomerDetail(data: any) {
    this.customer.getCustomerById(data).subscribe(
      (res) => {
        this.customerData = res.body;
        console.log(this.customerData);
      },
      (err) => {
        console.log(err)
      }
    )
  }
  resetSearch() {
    
      // this.searchQuery = '';
      this.fromDate = '';
      this.toDate = '';
      this.isSearch = false;
      this.onSearch(); // Reload data with empty filters
    
   this.getPayments()
   this.isSearch=false
  }
  goBack(){
    this.location.back()
  }
}
