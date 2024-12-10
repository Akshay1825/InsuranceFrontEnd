import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AdminService } from 'src/app/Services/admin.service';
import { AgentService } from 'src/app/Services/agent.service';
import { EmployeeService } from 'src/app/Services/employee.service';

@Component({
  selector: 'app-agent-body',
  templateUrl: './agent-body.component.html',
  styleUrls: ['./agent-body.component.css']
})
export class AgentBodyComponent {
  totalCommissionCount: number=0;
  totalPlanCount:number=0;
  totalCustomerCount:number=0;


constructor(private admin:AdminService, private agent:AgentService){}
ngOnInit(){
  this.getAllPlan()
  
  this.getCustomers()

  this.getCommission()
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
