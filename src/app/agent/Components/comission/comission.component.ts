import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AgentService } from 'src/app/Services/agent.service';
import { CustomerService } from 'src/app/Services/customer.service';
import { Location } from '@angular/common';
declare var window:any
@Component({
  selector: 'app-comission',
  templateUrl: './comission.component.html',
  styleUrls: ['./comission.component.css']
})
export class ComissionComponent {
  pageSizes=[5,10,20,30]
  pageSize = this.pageSizes[0];
  currentPage = 1;
  totalCommissionCount = 0;
  commissions:any={};
  headers: any
  searchQuery?:number
  detailModal:any
  customerData:any={}
  totalCommission:number=0
  agentProfile: any;
 constructor(private agent:AgentService,private customer:CustomerService,private location:Location){}
 ngOnInit(){
  this.getProfile()
 

 }
  getProfile() {
    debugger
    this.agent.getProfile().subscribe({
      next:(res)=>{
        this.agentProfile=res;
        console.log(res)
        this.getCommission();
      },
      error:(err:HttpErrorResponse)=>{
        console.log(err.message);
      }
    })
  }
 policyNumber!:number
 policyData:any={}
 getCommission(){
  debugger
  
   
   this.agent.getAgentCommission(this.agentProfile.agentId,this.currentPage,this.pageSize).subscribe(
    {
      next:(response: { headers: { get: (arg0: string) => any; }; body: any; })=>{
         const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);

        this.totalCommissionCount = paginationData.TotalCount;
        this.commissions=response.body
        this.AddIsWithdrawlProperty()
        console.log(this.commissions)
      },
      error:(err:HttpErrorResponse)=>{
        console.log(err)
      }
    }
   )
 }
  AddIsWithdrawlProperty() {
   
  }
 get pageNumbers(): number[] {
  return Array.from({ length: this.pageCount }, (_, i) => i + 1);
}
get pageCount(): number {
  return Math.ceil(this.totalCommissionCount / this.pageSize);
}
changePage(page: number) {

  this.currentPage = page;
  this.getCommission();
}
calculateSRNumber(index: number): number {
  return (this.currentPage - 1) * this.pageSize + index + 1;
}
onPageSizeChange(event: Event) {
  this.pageSize = +(event.target as HTMLSelectElement).value;
  this.getCommission();
}
onSearch() {
  let agentID=parseInt(localStorage.getItem('agentId')!) ;
  this.agent.getAgentCommission(agentID,this.currentPage,this.pageSize,this.searchQuery).subscribe(
    {
      next:(response: { headers: { get: (arg0: string) => any; }; body: any; })=>{
         const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);

        this.totalCommissionCount = paginationData.TotalCount;
        this.commissions=response.body
        this.AddIsWithdrawlProperty()
        console.log(this.commissions)
      },
      error:(err:HttpErrorResponse)=>{
        console.log(err)
      }
    }
   )
}
ViewDetail(index:number){
  this.policyNumber=this.commissions[index].policyId;
  this.customer.getPolicyDetail(this.policyNumber).subscribe(
    {
      next:(res)=>{
        console.log(res);
        this.policyData=res;
        this.getCustomerData(this.policyData.customerID)
      },
      error:(err:HttpErrorResponse)=>{
        console.log(err)
      }
    }
  )
  

}
getCustomerData(id:number){
  this.customer.getCustomerById(id).subscribe(
  (res)=>{
    console.log(res)
    this.customerData=res
  },
  (err)=>{
    console.log(err)
  }
  )

}
goBack(){
  this.location.back()
}

}
