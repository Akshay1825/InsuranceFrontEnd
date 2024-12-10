import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdminService } from 'src/app/Services/admin.service';

@Component({
  selector: 'app-view-emp',
  templateUrl: './view-emp.component.html',
  styleUrls: ['./view-emp.component.css']
})
export class ViewEmpComponent implements OnInit {

  isError = false
  isSearch=false
  currentPage = 1;
  totalEmployeeCount = 0;
  employees: any;
  headers: any
  paginatedEmployees: any[] = [];
  oldEmpObj: any
  pageSizes: number[] = [5,10,15, 20, 25,30,35,40,45,50];
  updateEmpForm!: FormGroup;
  pageSize = this.pageSizes[0];
  searchQuery: string | number = '';
  constructor(private admin: AdminService, private router: Router,private location:Location) { }
  ngOnInit(): void {
    this.getEmployees();
    this.updateEmpForm = new FormGroup({

      salary: new FormControl('', [Validators.min(0), Validators.required]),
    })
  }

goBack(){
  this.location.back()
}
  getEmployees() {
    this.admin.getEmployees(this.currentPage, this.pageSize).subscribe({
      next: (response) => {

        const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);

        this.totalEmployeeCount = paginationData.TotalCount;
        this.employees = response.body;


      }
    })
  }
  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  get pageCount(): number {
    return Math.ceil(this.totalEmployeeCount / this.pageSize);
  }



  changePage(page: number) {

    this.currentPage = page;
    this.getEmployees();
  }
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  onPageSizeChange(event: Event) {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getEmployees();
  }
  updatePaginatedEmployees() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedEmployees = this.employees.slice(start, end);
  }

  OnEdit(empObj: any) {
    this.oldEmpObj = JSON.stringify(empObj);
    this.paginatedEmployees.forEach(element => {
      element.isEdit = false;
    });
    empObj.isEdit = true;
  }
  onUpdate(empObj: any) {
    delete empObj.isEditable;
    if (this.updateEmpForm.valid) {
      console.log(empObj)
      this.admin.updateEmplyee(empObj).subscribe({
        next: (data) => {
          console.log(data);
          alert("Updated Successfully")
          location.reload()
        },
        error: (error: HttpErrorResponse) => {

          console.log(error);
        }


      })
      empObj.isEditable = !empObj.isEditable
    }
    else {
      this.isError = true
    }

  }
  onCancel(obj: any) {
    const oldObj = JSON.parse(this.oldEmpObj);
    obj.employeeFirstName = oldObj.employeeFirstName;
    obj.employeeLastName = oldObj.employeeLastName,
      obj.phone = oldObj.phone,
      obj.salary = oldObj.salary,
      obj.isEdit = false;
  }
  onDelete(emp: any) {
    debugger
    this.admin.deleteEmployee(emp.id).subscribe({
      next: (data) => {
        console.log(data)
        alert("Deleted Successfully");
        location.reload();

      },
      error(error: HttpErrorResponse) {
        alert("Something went wrong")
        console.log(error.message)
      }
    })
  }


  onSearch() {
    console.log(typeof this.searchQuery)
    this.admin.getFilterEmployees(this.currentPage, this.pageSize, this.searchQuery).subscribe({
      next: (response) => {

        const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);

        this.totalEmployeeCount = paginationData.TotalCount;
        this.employees = response.body;
        //this.updatePaginatedEmployees();

      },
      error:(err:HttpErrorResponse)=>{
        this.employees=[]
        console.log(err)
      }
    })
    this.isSearch=!this.isSearch
  }
  resetSearch(){
    this.searchQuery=''
    this.getEmployees()
    this.isSearch=false
  }
  addEmployee() {
    this.router.navigateByUrl("/admin/addEmployee")
  }
}
