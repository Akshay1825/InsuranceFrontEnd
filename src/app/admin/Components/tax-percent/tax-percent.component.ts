import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { AdminService } from 'src/app/Services/admin.service';
import { ValidateForm } from 'src/app/helper/validateForm';

@Component({
  selector: 'app-tax-percent',
  templateUrl: './tax-percent.component.html',
  styleUrls: ['./tax-percent.component.css']
})
export class TaxPercentComponent {

  taxPercentForm!:FormGroup 
  constructor(private admin:AdminService ,private location:Location){}
 
 
taxPercentModal:any
    ngOnInit(): void {
      this.taxPercentForm=new FormGroup({
        taxPercent:new FormControl('',[Validators.required,Validators.pattern(/^\d+(\.\d+)?$/)]),
      })
       }
       
       updateTax(): void{
        
        if(this.taxPercentForm.valid)
        {
          console.log(this.taxPercentForm.value)
          this.admin.updateTax(this.taxPercentForm.value).subscribe({
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
goBack(){
  this.location.back()
}
}
