import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { CustomerService } from 'src/app/Services/customer.service';

@Component({
  selector: 'app-view-complaint',
  templateUrl: './view-complaint.component.html',
  styleUrls: ['./view-complaint.component.css']
})

export class ViewComplaintComponent {
  searchQuery?: any
  currentPage = 1;
  totalComplaintCount = 0;
  complaints: any=[];
  headers: any
  paginatedEmployees: any[] = [];
  pageSizes: number[] = [5,10, 20, 30];

  pageSize = this.pageSizes[0];
  constructor(private customer: CustomerService, private router:Router,private location:Location) { }
  ngOnInit(): void {
    this.getCustomerComplaints();

  }
  goBack(){
    this.location.back()
  }
  getCustomerComplaints() {
    this.customer.getComplaints(localStorage.getItem("userName")!, this.currentPage, this.pageSize).subscribe({
      next: (response) => {

        const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);

        this.totalComplaintCount = paginationData.TotalCount;
        this.complaints = response.body;
        console.log(this.complaints)
        //this.updatePaginatedEmployees();

      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.complaints=[]
      }
    })
  }
  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  get pageCount(): number {
    return Math.ceil(this.totalComplaintCount / this.pageSize);
  }



  changePage(page: number) {

    this.currentPage = page;
    this.getCustomerComplaints();
  }
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  onPageSizeChange(event: Event) {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getCustomerComplaints();
  }
  onSearch() {
    this.customer.getComplaints(localStorage.getItem("userName")!, this.currentPage, this.pageSize, this.searchQuery).subscribe({
      next: (response) => {

        const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);

        this.totalComplaintCount = paginationData.TotalCount;
        this.complaints = response.body;
        //this.updatePaginatedEmployees();

      }
    })

  }
  addComplaint()
  {
    this.router.navigateByUrl('/customer/enquiry')
    
  }
}
