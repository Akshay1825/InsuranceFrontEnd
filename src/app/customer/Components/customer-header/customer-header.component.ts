import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/Services/auth.service';
import { CustomerService } from 'src/app/Services/customer.service';

@Component({
  selector: 'app-customer-header',
  templateUrl: './customer-header.component.html',
  styleUrls: ['./customer-header.component.css']
})
export class CustomerHeaderComponent {
  iPlans:any
  constructor(private customer:CustomerService, private auth:AuthService,private router:Router)
  {
   
  }
  ngOnInit(){
    this.customer.getAllPlan().subscribe({
      next:(data)=>{
          console.log(data)
          this.iPlans=data
      },
      error:(err:HttpClient)=>{
        console.log(err)
      } 

    });
  }

  showSchemes(index:number){
      this.router.navigateByUrl('/customer/plan/'+this.iPlans[index].planId)
    
  }
  showPolicies(){
    this.router.navigateByUrl('/customer/policies')
    
  }
  showDashboard(){
    this.router.navigateByUrl('/customer')
  }
  logOut(){
    this.auth.logOut();
  
  }
}
