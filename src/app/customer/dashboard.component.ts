import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../Services/customer.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  data: any

  constructor(private customer: CustomerService, private router: Router) {
   
  }


}
