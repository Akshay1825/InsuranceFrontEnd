import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/Services/admin.service';

@Component({
  selector: 'app-view-plan',
  templateUrl: './view-plan.component.html',

  styleUrls: ['./view-plan.component.css']
})

export class ViewPlanComponent {


  pageSize = 10;
  currentPage = 1;
  totalPlanCount = 0;
  plans: any;
  headers: any
  paginatedPlans: any[] = [];
  oldPlanObj: any
  planScheme: any
  searchQuery: string | number = '';
  pageSizes: any = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
  isSearch:boolean=false
  constructor(private admin: AdminService, private router: Router, private location: Location) {

  }
  ngOnInit() {
    // Initialize the DataTable
    this.getAllPlan();


  }



  getAllPlan(): void {
    this.admin.getPlans(this.currentPage, this.pageSize).subscribe({
      next: (response) => {

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

  oldPlan: any;
  onEdit(plan: any) {

    this.oldPlanObj = plan;
    this.plans.forEach((element: { isEdit: boolean; }) => {
      element.isEdit = false
    });
    this.oldPlan = JSON.stringify(plan);

    plan['isEdit'] = !plan['isEdit']

  }

  onSearch() {
    console.log(typeof this.searchQuery)
    this.admin.getFilterPlans(this.currentPage, this.pageSize, this.searchQuery).subscribe({
      next: (response) => {

        const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);

        this.totalPlanCount = paginationData.TotalCount;
        this.plans = response.body;
        //this.updatePaginatedEmployees();

      }
      
    })
    this.isSearch=!this.isSearch
  }



  onDelete(plan: any) {
    debugger
    this.admin.deletePlan(plan.planId).subscribe({
      next: (data) => {
        console.log(data)
        alert("Deleted Sucessfully");
        location.reload();

      },
      error(error: HttpErrorResponse) {
        alert(error.message)
        console.log(error.message)
      }
    })

  }

  viewScheme(plan: any) {

    this.admin.setPlan(plan);
    this.router.navigateByUrl('/admin/viewScheme/' + plan.planId)
  }
  registerPlan() {
    this.router.navigateByUrl('/admin/addPlan')
  }
  goBack() {
    this.location.back()
  }
  resetSearch(){
    this.searchQuery=''
    this.getAllPlan()
    this.isSearch=false
  
  }
}