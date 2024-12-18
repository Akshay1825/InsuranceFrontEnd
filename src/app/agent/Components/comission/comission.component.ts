import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AgentService } from 'src/app/Services/agent.service';
import { CustomerService } from 'src/app/Services/customer.service';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';

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
  policyId:any;
  detailModal:any
  customerData:any={}
  totalCommission:number=0
  agentProfile: any;
  constructor(private agent:AgentService,private http:HttpClient,private customer:CustomerService,private location:Location){}
  ngOnInit(){
  this.getProfile()
  
 }
  getProfile() {
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
   this.agent.getAgentCommission(this.agentProfile.body.customer.id,this.currentPage,this.pageSize,this.searchQuery).subscribe(
    {
      
      next:(response: { headers: { get: (arg0: string) => any; }; body: any; })=>{
        console.log();
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

roundToTwoDecimals(value: number): number {
  if (isNaN(value)) return 0;
  return Math.round(value * 100) / 100;
}
onSearch() {
  // let agentID=parseInt(localStorage.getItem('agentId')!) ;
  this.agent.getAgentCommission(this.agentProfile.body.customer.id,this.pageSize,this.searchQuery).subscribe(
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
  this.policyId=this.commissions[index].policyId;
  console.log(this.policyId);
  this.customer.getPolicyDetail(this.policyId).subscribe(
    {
      next:(res)=>{
        console.log(res);
        this.policyData=res.body;
        this.getCustomerData(this.policyData['customerId']);
      },
      error:(err:HttpErrorResponse)=>{
        console.log(err)
      }
    }
  )
}

withdrawCommission(commission:any) {
  commission.status = 1;
  console.log('Withdrawn commission with ID:', commission);

  this.updateCommissionStatus(commission).subscribe(
    (response) => {
      console.log('Commission status updated successfully', response);
      alert('Commission withdrawn successfully!');
    },
    (error) => {
      console.error('Error updating commission status:', error);
      alert('Something went wrong while updating the commission status.');
    }
  );
}

// Directly calling the API to update the commission status
updateCommissionStatus(commission: any): Observable<any> {
  return this.http.put("https://localhost:7117/api/Commission", commission,{observe:'response'});
}

getCustomerData(id:any){
  this.customer.getCustomerById(id).subscribe(
  (res)=>{
    console.log(res)
    this.customerData=res.body;
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
