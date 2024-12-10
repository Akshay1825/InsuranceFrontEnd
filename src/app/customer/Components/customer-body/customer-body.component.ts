import { Component } from '@angular/core';
import { AdminService } from 'src/app/Services/admin.service';
import { CustomerService } from 'src/app/Services/customer.service';

@Component({
  selector: 'app-customer-body',
  templateUrl: './customer-body.component.html',
  styleUrls: ['./customer-body.component.css']
})
export class CustomerBodyComponent {
  customerProfile: any ={};
  headers:any
  totalNoAgent:number=0
  constructor(private customer:CustomerService,private admin:AdminService){}
  ngOnInit(){
    this.getProfile()
    this.getAgents()
  }
  getProfile(){
  
    this.customer.getCustomerProfile().subscribe({
      next:(response)=>{
        this.customerProfile=response
        console.log(response);
      },
      error:(err)=>{
        console.log(err)
      }
    })
   }
   getAgents()
   {
    this.admin.getFilterAgents(1,10).subscribe(
      {
        next:(response)=>{
        
          const paginationHeader = response.headers.get('X-Pagination');
          console.log(paginationHeader);
          const paginationData = JSON.parse(paginationHeader!);
          console.log(paginationData.TotalCount);
  
          this.totalNoAgent = paginationData.TotalCount;
        }
      }
    )

   }
}
