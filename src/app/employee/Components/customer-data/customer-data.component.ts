import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AdminService } from 'src/app/Services/admin.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-customer-data',
  templateUrl: './customer-data.component.html',
  styleUrls: ['./customer-data.component.css']
})
export class CustomerDataComponent {

  isEmployee=false
  isAdmin=false
  jwtHelper=new JwtHelperService()
  currentPage = 1;
  isSearch:boolean=false
totalCustomerCount = 0;
customerData: any=[];
headers: any
oldEmpObj: any
pageSizes: number[] = [5,10,15, 20, 25,30,35,40,45,50];
pageSize = this.pageSizes[0];
searchQuery:string|number='';
constructor(private admin: AdminService, private router: Router, private location:Location) { }
  ngOnInit(){
  const decodedToken= this.jwtHelper.decodeToken(localStorage.getItem('token')!);
  const role: string = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  if(role==='EMPLOYEE')
  {
   this.isEmployee=true
  }
  else{
   this.isAdmin=true
  }

  this.getCustomers()
}

goBack(){
  this.location.back()
}
getCustomers() {
  this.admin.getFilterCustomers(this.currentPage, this.pageSize).subscribe({
    next: (response) => {

      const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
         console.log(paginationData.TotalCount);

        this.totalCustomerCount=paginationData.TotalCount;
      this.customerData = response.body;

    },
    error:(err:HttpErrorResponse)=>{
      this.customerData=[]
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
onPageSizeChange(event:Event){
  this.pageSize = +(event.target as HTMLSelectElement).value;
  this.getCustomers();
}
onSearch()
{
  this.admin.getFilterCustomers(this.currentPage, this.pageSize,this.searchQuery).subscribe({
    next: (response) => {

      const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
         console.log(paginationData.TotalCount);

        this.totalCustomerCount=paginationData.TotalCount;
      this.customerData = response.body;
           //this.updatePaginatedEmployees();

    },
    error:(err:HttpErrorResponse)=>{
      this.customerData=[]
    }
  })
  this.isSearch=!this.isSearch
}
resetSearch(){
  this.searchQuery=''
  this.getCustomers()
  this.isSearch=false

}
viewDocument(data:any){
  if(this.isEmployee)
  {
    this.router.navigateByUrl("/employee/customers/document/"+data.customerId)
  }
  else{
    this.router.navigateByUrl("/admin/customers/document/"+data.customerId)
  }


}
viewPolicies(data:any){
  if(this.isEmployee)
  {
    this.router.navigateByUrl("/employee/customers/policies/"+data.customerId)
  }
  else{
    this.router.navigateByUrl("/admin/customers/policies/"+data.customerId)
  }
}


}
