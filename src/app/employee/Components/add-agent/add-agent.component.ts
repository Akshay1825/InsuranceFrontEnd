import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { AdminService } from 'src/app/Services/admin.service';
import { ValidateForm } from 'src/app/helper/validateForm';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.css']
})
export class AddAgentComponent {
  addAgentForm=new FormGroup({
    firstName:new FormControl('',[Validators.required,ValidateForm.onlyCharactersValidator,Validators.minLength(3)]),
    lastName:new FormControl('',[Validators.required,ValidateForm.onlyCharactersValidator]),
    userName:new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(20)]),
    qualification:new FormControl('',Validators['required']),
    email:new FormControl('',[Validators.required,Validators.email]),
    mobileNumber:new FormControl('',[Validators.required,Validators.pattern(/^[0-9]{10}$/)]),
    salary:new FormControl('',),
    password:new FormControl('',[Validators.required,ValidateForm.passwordPatternValidator]),
  })

  token :any='';
  addModal:any;
  employeeData:any;
  
constructor( private admin:AdminService,private router:Router,private location:Location){
 
}
  ngOnInit(): void {

  }
  
  
  addAgent(): void{
    if(this.addAgentForm.valid){
      console.log(this.addAgentForm.value)
      this.admin.addAgent(this.addAgentForm.value).subscribe({
        next:(data)=>{
          console.log(data)
          alert("Added Successfully")
          this.goBack();
          
        },
        error:(error:HttpErrorResponse)=>{
          alert("Agent Not Added")
          console.log(error.message)
        }
      })
    }
    else{
      ValidateForm.validateAllFormFileds(this.addAgentForm);
      alert("One or more feilds required")
    }
  }
  onCancel(){
    this.addAgentForm.reset()
  }
  goBack(){
    this.location.back()
  }
}
