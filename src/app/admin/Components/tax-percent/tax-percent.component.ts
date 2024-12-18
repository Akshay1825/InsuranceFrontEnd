import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CustomerService } from 'src/app/Services/customer.service';
import { AdminService } from 'src/app/Services/admin.service';
import { ValidateForm } from 'src/app/helper/validateForm';

@Component({
  selector: 'app-tax-percent',
  templateUrl: './tax-percent.component.html',
  styleUrls: ['./tax-percent.component.css']
})
export class TaxPercentComponent implements OnInit {

  taxPercentForm!:FormGroup 
  Tax: any;
  constructor(private admin:AdminService ,private customer:CustomerService,private location:Location){}
 
 
taxPercentModal:any
    ngOnInit(): void {
      this.getTax();
      this.taxPercentForm=new FormGroup({
        taxPercent:new FormControl('',[Validators.required,Validators.pattern(/^\d+(\.\d+)?$/)]),
      })
       }
       
       updateTax(): void{
        
        if(this.taxPercentForm.valid)
        {
          console.log(this.taxPercentForm.value)
          this.Tax[0].taxPercentage = this.taxPercentForm.value.taxPercent;

          this.admin.updateTax(this.Tax[0]).subscribe({
            next:(data:any)=>{
              alert("Updated Successfully") 
              this.taxPercentForm.reset()
            
            },
            error:(error:HttpErrorResponse)=>{
              console.log(error)
            }
          })
         
        }
        else{
          ValidateForm.validateAllFormFileds(this.taxPercentForm);
          alert("One or more feilds required")  
        }
       
    
      }

      getTax() {
        this.customer.getTaxPercent().subscribe({
          next: (res) => {
            this.Tax = res.body;
            // console.log(this.Tax.body[0].taxPercentage)
          },
          error: (err: HttpErrorResponse) => {
            console.log(err.message);
          }
        })
      }
goBack(){
  this.location.back()
}
}
