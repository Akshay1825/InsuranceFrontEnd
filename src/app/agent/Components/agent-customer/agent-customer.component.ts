import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Location } from '@angular/common';
import { AgentService } from 'src/app/Services/agent.service';
import { CustomerService } from 'src/app/Services/customer.service';

@Component({
  selector: 'app-agent-customer',
  templateUrl: './agent-customer.component.html',
  styleUrls: ['./agent-customer.component.css']
})
export class AgentCustomerComponent {
  isEmployee = false
  isAdmin = false
  jwtHelper = new JwtHelperService()
  currentPage = 1;
  totalCustomerCount = 0;
  customerData: any;
  headers: any

 
  pageSizes: number[] = [5, 10, 20, 30];
  agentProfile: any
  pageSize = this.pageSizes[0];
  searchQuery: string | number = '';
  constructor(private router: Router, private location: Location, private agent: AgentService) { }
  ngOnInit() {

    this.getCustomers()

  }
  getAgentProfile() {

    this.agent.getProfile().subscribe({
      next: (res) => {
        this.agentProfile = res;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    })
  }

  getCustomers() {
    this.agent.getAgentCustomers(localStorage.getItem('userName')!, this.currentPage, this.pageSize, this.searchQuery).subscribe({
      next: (response) => {

        const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);

        this.totalCustomerCount = paginationData.TotalCount;
        this.customerData = response.body;
      }
    })

  }
  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  get pageCount(): number {
    return Math.ceil(this.totalCustomerCount / this.pageSize);
  }



  changePage(page: number) {

    this.currentPage = page;
    this.getCustomers();
  }
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  onPageSizeChange(event: Event) {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getCustomers();
  }
  onSearch() {
    this.getCustomers();
  }
  viewDocument(data: any) {
    this.router.navigateByUrl("/agent/customers/document/" + data.customerId);

  }
  viewPolicies(data:any){
    this.router.navigateByUrl("/agent/customer/policies/" + data.customerId);
  }
  goBack(){
    this.location.back()
  }

}
