
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AgentService } from 'src/app/Services/agent.service';
import { CustomerService } from 'src/app/Services/customer.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
  fromDate: any// To store the 'From Date'
  toDate: any;
  constructor(private agent:AgentService,private http:HttpClient,private customer:CustomerService,private location:Location){}
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
 rejectCommission(commission:any)
 {
  commission.status = 3;
  console.log('Withdrawn commission with ID:', commission);

  this.updateCommissionStatus(commission).subscribe(
    (response) => {
      console.log('Commission status updated successfully', response);
      alert('Commission Updated successfully');
      this.getCommission()
    },
    (error) => {
      console.error('Error updating commission status:', error);
      alert('Something went wrong while updating the commission status.');
    }
  );
    
 }

 approveCommission(commission:any)
 {
  commission.status = 2;
  console.log('Withdrawn commission with ID:', commission);

  this.updateCommissionStatus(commission).subscribe(
    (response) => {
      console.log('Commission status updated successfully', response);
      alert('Commission Updated successfully');
      this.getCommission()
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
  this.agent.getCommission(this.currentPage,this.pageSize,this.fromDate,this.toDate).subscribe(
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
ViewDetail(index:any){
  console.log(index);
  this.policyNumber=this.commissions[index].policyId;
  this.customer.getPolicyDetail(this.policyNumber).subscribe(
    {
      next:(res)=>{
        console.log(res);
        this.policyData=res.body;
        console.log(this.policyData);
        this.getCustomerData(this.policyData.customerId)
      },
      error:(err:HttpErrorResponse)=>{
        console.log(err)
      }
    }
  )
  

}
getCustomerData(id:any){
  this.customer.getCustomerById(id).subscribe(
  (res)=>{
    console.log(res)
    this.customerData=res.body;
    console.log(this.customerData);
  },
  (err)=>{
    console.log(err)
  }
  )

}

roundToTwoDecimals(value: number): number {
  if (isNaN(value)) return 0;
  return Math.round(value * 100) / 100;
}
resetSearch(){
  this.fromDate = null;
    this.toDate = null;
  this.getCommission()
  this.isSearch=false

}
}
