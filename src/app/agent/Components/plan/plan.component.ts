import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/Services/admin.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent {
  pageSizes=[5,10,20,30]
  pageSize = this.pageSizes[0];
  currentPage = 1;
  totalPlanCount = 0;
  plans: any;
  headers: any
  paginatedPlans: any[] = [];
  oldPlanObj: any
  planScheme: any
  searchQuery: string | number = '';
  constructor(private admin: AdminService, private router: Router, private location:Location) {

  }
  ngOnInit() {
    // Initialize the DataTable
    this.getAllPlan();


  }

goBack(){
  this.location.back()
}

  getAllPlan(): void {
    this.admin.getPlans(this.currentPage, this.pageSize).subscribe({
      next: (response: { headers: { get: (arg0: string) => any; }; body: any; }) => {

        const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);

        this.totalPlanCount = paginationData.TotalCount;
        this.plans = response.body;
        //this.updatePaginatedEmployees();

      }
    })
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  get pageCount(): number {
    return Math.ceil(this.totalPlanCount / this.pageSize);
  }
  changePage(page: number) {

    this.currentPage = page;
    this.getAllPlan();
  }
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  onPageSizeChange(event: Event) {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getAllPlan();
  }

  onSearch() {
    console.log(typeof this.searchQuery)
    this.admin.getFilterPlans(this.currentPage, this.pageSize, this.searchQuery).subscribe({
      next: (response: { headers: { get: (arg0: string) => any; }; body: any; }) => {

        const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);

        this.totalPlanCount = paginationData.TotalCount;
        this.plans = response.body;
        //this.updatePaginatedEmployees();

      }
    })
  }


 
 

  viewScheme(plan: any) {

    this.admin.setPlan(plan);
    this.router.navigateByUrl('/agent/view/plan/' + plan.planId)
  }
}
