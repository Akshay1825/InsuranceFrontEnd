import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/Services/admin.service';
import { AgentService } from 'src/app/Services/agent.service';
import { EmployeeService } from 'src/app/Services/employee.service';


@Component({
  selector: 'app-admin-body',
  templateUrl: './admin-body.component.html',
  styleUrls: ['./admin-body.component.css']
})
export class AdminBodyComponent {
totalPlanCount: number=0;
  totalAgentCount: number=0;
  totalEmployeeCount: number=0;
  totalCustomerCount: number=0;
  totalPaymentCount: number=0;
  totalClaimCount: number=0;
  totalComplaintCount:number=0;
  totalCommissionCount: number=0;



constructor(private admin:AdminService, private agent:AgentService,private employee:EmployeeService){}
ngOnInit(){
  this.getAllPlan()
  this.getAgents()
  this.getEmployees()
  this.getCustomers()
  this.getPayments()
  this.getAllComplaints()
  this.getCommission()
  this.getClaims()
}

getAllPlan(): void {
  this.admin.getPlans(1, 10).subscribe({
    next: (response:any) => {

      const paginationHeader = response.headers.get('X-Pagination');
      console.log(paginationHeader);
      const paginationData = JSON.parse(paginationHeader!);
      console.log(paginationData.TotalCount);

      this.totalPlanCount = paginationData.TotalCount;
     
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
getEmployees() {
  this.admin.getEmployees(1, 10).subscribe({
    next: (response) => {

      const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
         console.log(paginationData.TotalCount);

        this.totalEmployeeCount=paginationData.TotalCount;
 
           //this.updatePaginatedEmployees();

    }
  })
}
getCustomers() {
  this.admin.getFilterCustomers(1,10).subscribe({
    next: (response) => {

      const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
         console.log(paginationData.TotalCount);

        this.totalCustomerCount=paginationData.TotalCount;
    
           //this.updatePaginatedEmployees();

    }
  })
}
getPayments() {
  

  this.admin.getPayments(1,5).subscribe({
    next: (response) => {
      const paginationHeader = response.headers.get('X-Pagination');
      console.log(paginationHeader);
      const paginationData = JSON.parse(paginationHeader!);
      console.log(paginationData.TotalCount);

      this.totalPaymentCount = paginationData.TotalCount;
    

    },
    error: (err) => {
      console.log(err);
    }
  })
}
getClaims() {
  
      this.employee.getClaims(1, 10).subscribe(
        (response) => {
          const paginationHeader = response.headers.get('X-Pagination');
          console.log(paginationHeader);
          const paginationData = JSON.parse(paginationHeader!);
          console.log(paginationData.TotalCount);
         this.totalClaimCount=paginationData.TotalCount
          
        },
        (err) => {
          console.log(err.message);
       
        }
      )
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
getCommission(){

  this.agent.getCommission(1,10).subscribe(
   {
     next:(response: { headers: { get: (arg0: string) => any; }; body: any; })=>{
        const paginationHeader = response.headers.get('X-Pagination');
       console.log(paginationHeader);
       const paginationData = JSON.parse(paginationHeader!);
       console.log(paginationData.TotalCount);

       this.totalCommissionCount = paginationData.TotalCount;
       
     },
     error:(err:HttpErrorResponse)=>{
       console.log(err)
      
     }
   }
  )
}
}