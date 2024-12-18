import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AgentService } from 'src/app/Services/agent.service';

@Component({
  selector: 'app-agent-profile',
  templateUrl: './agent-profile.component.html',
  styleUrls: ['./agent-profile.component.css']
})
export class AgentProfileComponent {
agentProfile:any
isEdited: boolean = false;

constructor(private agent:AgentService,private location:Location){}
  ngOnInit(){
    this.getAgentProfile()
    }
    validateEmail(item:any){
     const regexPattern=/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
     if(regexPattern.test(item))
      return false;
     return true
    }
    validatePhone(item:any){
     const regexPattern=/^\d{10}$/;
     if(regexPattern.test(item))
     return false
   return true
    }
    validateField(item:any){
     if(item!=='')
     return false;
    else
     return true
   
    }
    validateForm(obj:any)
    {
     if((!this.validateField(obj.phone)&&!this.validatePhone(obj.phone))||(!this.validateField(obj.email)&&!this.validateEmail(obj.email))||(!this.validateField(obj.address))){
   return true
     }
     return false
    }
    getAgentProfile(){
     this.agent.getProfile().subscribe({
       next:(res)=>{
         this.agentProfile=res;
         console.log(this.agentProfile);
       },
       error:(err:HttpErrorResponse)=>{
         console.log(err.message);
       }
     })
    }
    onAgentEdit(){
   
     this.isEdited=true
    }
    updateAgentProfile()
    {
     console.log(this.agentProfile)
     if(this.validateForm(this.agentProfile)){
      this.agent.updateAgent(this.agentProfile.body.customer).subscribe({
       next:(res)=>{
      
         alert("Updated Successfully");
         location.reload()
        
       },
       error:(err:HttpErrorResponse)=>{
         alert(err.message);
       }
      })
   
    }
    else{
      alert("Invalid Details")
    }
  }
  OnCancel(){
    this.isEdited=false;
    this.getAgentProfile();
  }
  goBack(){
    this.location.back()
  }
}
