import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdminService } from 'src/app/Services/admin.service';
import { CustomerService } from 'src/app/Services/customer.service';
import { AgentService } from 'src/app/Services/agent.service';



@Component({
  selector: 'app-agent-customer-policy',
  templateUrl: './agent-customer-policy.component.html',
  styleUrls: ['./agent-customer-policy.component.css']
})
export class AgentCustomerPolicyComponent {
  currentPage = 1;
  totalPolicyCount = 0;
  policies: any=[];
  headers: any
  customerData:any
  oldEmpObj: any
  pageSizes: number[] = [5,10, 20, 30];
  user:any
  pageSize = this.pageSizes[0];
  searchQuery?:number;
  customerID!: any;
  isSwitchOn: boolean = true;
  agentProfile: any={};

  constructor(private location: Location, private agent: AgentService,private customer:CustomerService, private activatedroute:ActivatedRoute) { }
  ngOnInit(){
    this.customerID = this.activatedroute.snapshot.paramMap.get('id');
    console.log(this.customerID);
    this.getAgentProfile();
  }
  getAgentProfile() {
    this.agent.getProfile().subscribe({
      next: (res) => {
        this.agentProfile = res;
        console.log(this.agentProfile);
        this.getCustomerPolicies();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    })
  }
  getCustomer() {
    console.log(this.customerID);
   this.customer.getCustomerById(this.customerID).subscribe(
    {
      next:(res)=>{
        this.customerData=res
        console.log(this.customerData)
        this.customer.getUserById(this.customerData.userID).subscribe({
          next:(res)=>{
            this.user=res;
           
          },
          error:(err:HttpErrorResponse)=>{
            console.log(err)
          }
         })
      },
      error:(err:HttpErrorResponse)=>{
        console.log(err)
      }
    }
   )
  }





  toggleSwitch(state: boolean) {
    this.isSwitchOn = state;
    
    
  }
  getCustomerPolicies(){
    this.agent.getAgentPolicies(this.agentProfile.body.customer.id, this.currentPage, this.pageSize,this.searchQuery).subscribe({
      next: (response) => {
        console.log(response);
        const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);

        this.totalPolicyCount = paginationData.TotalCount;
        this.policies = response.body;
        console.log(this.policies)
        //this.updatePaginatedEmployees();

      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this.policies=[]
      }
    })
  }
  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  get pageCount(): number {
    return Math.ceil(this.totalPolicyCount / this.pageSize);
  }
  
  
  
  changePage(page: number) {
   
    this.currentPage = page;
     this.getCustomerPolicies();
  }
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  onPageSizeChange(event:Event){
    this.pageSize = +(event.target as HTMLSelectElement).value;
     this.getCustomerPolicies();
  }
  onSearch() {
    // let status = this.isSwitchOn ? 0 : 1
    this.agent.getAgentPolicies(this.agentProfile.body.customer.id, this.currentPage, this.pageSize,this.searchQuery).subscribe({
      next: (response) => {

        const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);

        this.totalPolicyCount = paginationData.TotalCount;
        this.policies = response.body;
        console.log(this.policies)
      },
      error:(err:HttpErrorResponse)=>{
        this.policies=[]
        console.log(err)
      }
    })

  }
  goBack(){
    this.location.back()
  }
}
