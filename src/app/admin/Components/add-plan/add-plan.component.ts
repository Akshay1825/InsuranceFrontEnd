import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { AdminService } from 'src/app/Services/admin.service';

import { ValidateForm } from 'src/app/helper/validateForm';

@Component({
  selector: 'app-add-plan',
  templateUrl: './add-plan.component.html',
  styleUrls: ['./add-plan.component.css']
})
export class AddPlanComponent  {

    
  constructor(private admin:AdminService ,private location:Location){}
 
    addPlanForm=new FormGroup({
      planName:new FormControl('',[Validators.required,ValidateForm.onlyCharactersValidator]),
    })

       addPlan(): void{
        if(this.addPlanForm.valid)
        {
          console.log(this.addPlanForm.value)
          this.admin.addPlan(this.addPlanForm.value).subscribe({
            next:(data:any)=>{
              
              console.log(data)
              this.addPlanForm.reset();
              alert("Plan Added Successfully") 
              this.goBack();
            
            },
            error:(error:HttpErrorResponse)=>{
              console.log(error)
              alert("Plan Name Already Exists");
              
              this.addPlanForm.reset();
            }
          })
         
        }
        else{
          ValidateForm.validateAllFormFileds(this.addPlanForm);
          alert("One or more feilds required")  
        }
       
    
      }
      OnCancel() {
        this.addPlanForm.reset()
        }
goBack(){
  this.location.back()
}
}
