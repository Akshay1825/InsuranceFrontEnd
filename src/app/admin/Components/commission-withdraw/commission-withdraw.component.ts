
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AgentService } from 'src/app/Services/agent.service';
import { CustomerService } from 'src/app/Services/customer.service';

@Component({
  selector: 'app-commission-withdraw',
  templateUrl: './commission-withdraw.component.html',
  styleUrls: ['./commission-withdraw.component.css']
})
export class CommissionWithdrawComponent {
  pageSizes=[5,10,15,20,25,30,35,40,45,50]
  pageSize = this.pageSizes[0];
  currentPage = 1;
  totalCommissionCount = 0;
  commissions:any=[];
  headers: any
  searchQuery?:number
  isSearch:boolean=false
  detailModal:any
  customerData:any={}
  totalCommission:number=0
  AgentId!: number;
  constructor(private agent:AgentService,private customer:CustomerService,private location:Location){}
 ngOnInit(){
 
  this.getCommission();

 }
 goBack(){
  this.location.back()
 }
 policyNumber!:number
 policyData:any={}
 getCommission(){

   this.agent.getCommission(this.currentPage,this.pageSize).subscribe(
    {
      next:(response: { headers: { get: (arg0: string) => any; }; body: any; })=>{
         const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);

        this.totalCommissionCount = paginationData.TotalCount;
        this.commissions=response.body
        
        console.log(this.commissions)
      },
      error:(err:HttpErrorResponse)=>{
        console.log(err)
        this.commissions=[]
      }
    }
   )
 }
 updateCommission(data:any)
 {
  data.status=0;
  this.agent.updateAgentCommission(data).subscribe(
    {
      next:(res)=>{
        alert("Approved Successfully");
        this.getCommission()
      },
      error:(err:HttpErrorResponse)=>{
        alert("Something went wrong!");
        console.log(err);
      }
    }
  )
  
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
  this.agent.getCommission(this.currentPage,this.pageSize,this.searchQuery).subscribe(
    {
      next:(response: { headers: { get: (arg0: string) => any; }; body: any; })=>{
         const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);

        this.totalCommissionCount = paginationData.TotalCount;
        this.commissions=response.body
        
        console.log(this.commissions)
      },
      error:(err:HttpErrorResponse)=>{
        console.log(err)
      }
    }
   )
   this.isSearch=!this.isSearch
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
resetSearch(){
  this.searchQuery=undefined
  this.getCommission()
  this.isSearch=false

}
}
