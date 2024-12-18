import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AgentService } from 'src/app/Services/agent.service';
import { CustomerService } from 'src/app/Services/customer.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-agent-commission',
  templateUrl: './admin-agent-commission.component.html',
  styleUrls: ['./admin-agent-commission.component.css']
})
export class AdminAgentCommissionComponent {
  pageSizes=[5,10,20,30]
  pageSize = this.pageSizes[0];
  currentPage = 1;
  totalCommissionCount = 0;
  commissions:any=[];
  headers: any
  searchQuery?:number
  detailModal:any
  customerData:any={}
  totalCommission:number=0
  AgentId!: any;
  isEmployee!: boolean;
  isAdmin!: boolean;
  jwtHelper=new JwtHelperService()
 constructor(private agent:AgentService,private router:Router,private customer:CustomerService, private activateRoute:ActivatedRoute,private location:Location){}
 ngOnInit(){
  this.AgentId=this.activateRoute.snapshot.paramMap.get('id');
  const decodedToken= this.jwtHelper.decodeToken(localStorage.getItem('token')!);
  const role: string = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  if(role==='EMPLOYEE')
  {
   this.isEmployee=true
  }
  else{
   this.isAdmin=true
  }
  this.getCommission();
  
 }
 goBack(){
  this.location.back()
 }
 policyNumber!:number
 policyData:any={}
 getCommission(){
   this.agent.getAgentCommission(this.AgentId,this.currentPage,this.pageSize).subscribe(
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
        if (!Array.isArray(this.commissions) || this.commissions.length === 0) {
          alert("No commission found for this Agent");
          this.goBack();
          return;
        }
        console.log(err)
        this.commissions=[]
      }
    }
   )
 }
 updateCommission(data:any)
 {
  data.status=true;
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

roundToTwoDecimals(value: number): number {
  if (isNaN(value)) return 0;
  return Math.round(value * 100) / 100;
}
calculateSRNumber(index: number): number {
  return (this.currentPage - 1) * this.pageSize + index + 1;
}
onPageSizeChange(event: Event) {
  this.pageSize = +(event.target as HTMLSelectElement).value;
  this.getCommission();
}
onSearch() {
  // console.log(typeof this.searchQuery)
  // this.admin.getFilterPlans(this.currentPage, this.pageSize, this.searchQuery).subscribe({
  //   next: (response: { headers: { get: (arg0: string) => any; }; body: any; }) => {

  //     const paginationHeader = response.headers.get('X-Pagination');
  //     console.log(paginationHeader);
  //     const paginationData = JSON.parse(paginationHeader!);
  //     console.log(paginationData.TotalCount);

  //     this.totalPlanCount = paginationData.TotalCount;
  //     this.plans = response.body;
  //     //this.updatePaginatedEmployees();

  //   }
  // })
}
ViewDetail(index:number){
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
    
  },
  (err)=>{
    console.log(err)
  }
  )

}
}
