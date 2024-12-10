import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { AdminService } from 'src/app/Services/admin.service';
import { __values } from 'tslib';
import { ValidateForm } from 'src/app/helper/validateForm';

@Component({
  selector: 'app-add-emp',
  templateUrl: './add-emp.component.html',
  styleUrls: ['./add-emp.component.css']
})
export class AddEmpComponent {

  addEmpForm=new FormGroup({
    firstName:new FormControl('',[Validators.required,ValidateForm.onlyCharactersValidator]),
    lastName:new FormControl('',[Validators.required,ValidateForm.onlyCharactersValidator]),
    userName:new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(20)]),
    email:new FormControl('',[Validators.required,Validators.email]),
    mobileNumber:new FormControl('',[Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
    salary:new FormControl('',[Validators.min(0)]),
    password:new FormControl('',[Validators.required,ValidateForm.passwordPatternValidator]),
  })

  token :any='';
  addModal:any;
  employeeData:any;

constructor( private admin:AdminService,private location:Location){
 
}
goBack(){
  this.location.back()
}
OnCancel() {
  this.addEmpForm.reset()
  }
  
  
  addEmp(): void{
    if(this.addEmpForm.valid){
      console.log(this.addEmpForm.value)
      this.admin.addEmp(this.addEmpForm.value).subscribe({
        next:(data)=>{
         this.addEmpForm.reset()
          console.log(data)
          alert("Added Successfully") 
        },
        error:(error:HttpErrorResponse)=>{
          console.log(error)
          this.addEmpForm.reset()
          alert(error.error.Message)
        }
      })
    }
    else{
      ValidateForm.validateAllFormFileds(this.addEmpForm);
      alert("One or more feilds required")
    }
  }
}