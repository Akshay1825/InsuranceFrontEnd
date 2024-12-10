import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AdminService } from 'src/app/Services/admin.service';
import { EmployeeService } from 'src/app/Services/employee.service';

@Component({
  selector: 'app-employee-body',
  templateUrl: './employee-body.component.html',
  styleUrls: ['./employee-body.component.css']
})
export class EmployeeBodyComponent {
  totalCustomerCount:number=0;
  totalAgentCount: number=0;
  totalComplaintCount: number=0;
  constructor(private admin:AdminService,private employee:EmployeeService){}
ngOnInit(){

  this.getAgents()
 
  this.getCustomers()
  this.getAllComplaints()
}
  getCustomers() {
    this.admin.getFilterCustomers(1,10).subscribe({
      next: (response: { headers: { get: (arg0: string) => any; }; }) => {
  
        const paginationHeader = response.headers.get('X-Pagination');
          console.log(paginationHeader);
          const paginationData = JSON.parse(paginationHeader!);
           console.log(paginationData.TotalCount);
  
          this.totalCustomerCount=paginationData.TotalCount;
      
             //this.updatePaginatedEmployees();
  
      }
    })
  }
  getAgents(){
    this.admin.getFilterAgents(1, 10).subscribe({
      next: (response: { headers: { get: (arg0: string) => any; }; body: any; }) => {
  
        const paginationHeader = response.headers.get('X-Pagination');
          console.log(paginationHeader);
          const paginationData = JSON.parse(paginationHeader!);
           console.log(paginationData.TotalCount);
  
          this.totalAgentCount=paginationData.TotalCount;
       
             //this.updatePaginatedEmployees();
  
      },
      error:(err:HttpErrorResponse)=>{
     
        console.log(err.message);
  
      }
    })
  }
  getAllComplaints() {
    this.employee.getFilterQueries(1,10).subscribe({
      next: (response: { headers: { get: (arg0: string) => any; }; }) => {
  
        const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);
  
        this.totalComplaintCount = paginationData.TotalCount;
      
        //this.updatePaginatedEmployees();
  
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    })
  }
}
