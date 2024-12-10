import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/Services/admin.service';
import { ValidateForm } from 'src/app/helper/validateForm';
import { Location } from '@angular/common';
@Component({
  selector: 'app-add-scheme',
  templateUrl: './add-scheme.component.html',
  styleUrls: ['./add-scheme.component.css']
})
export class AddSchemeComponent {
addSchemeForm!: FormGroup;
planId!: number;
constructor(private admin:AdminService, private activatedroute:ActivatedRoute,private location:Location){}
ngOnInit()
{
  this.planId = (Number)(this.activatedroute.snapshot.paramMap.get('id'));
  this.addSchemeForm=new FormGroup({
    schemeName:new FormControl('',[Validators.required,ValidateForm.onlyCharactersValidator]),
    schemeImage:new FormControl(''),
    description:new FormControl('',[Validators.required,ValidateForm.onlyCharactersValidator]),
    minInvestmentAmount:new FormControl('',[Validators.required,Validators.min(0)]),
    maxInvestmentAmount:new FormControl('',[Validators.required]),
    minAge:new FormControl('',[Validators.required,Validators.min(1)]),
    maxAge:new FormControl('',[Validators.required,Validators.min(100)]),
    minTerm:new FormControl('',[Validators.required,Validators.min(1)]),
    maxTerm:new FormControl('',[Validators.required,Validators.max(50)]),
    profitPercent:new FormControl('',[Validators.required,Validators.min(0)]),
    firstPremiumCommissionPercent:new FormControl('',[Validators.required,Validators.min(0)]),
    emiCommissionPercent:new FormControl('',[Validators.required,Validators.min(0)]),

    planID:new FormControl('',[Validators.required])

   });
}
addScheme(){
  debugger
  this.addSchemeForm.get('planID')?.setValue(this.planId)
  this.admin.addSchemeWithDetail(this.addSchemeForm.value).subscribe((res)=>{
    alert("Added Successfully");
    location.reload()
  },
  (err:HttpErrorResponse)=>{
    alert(err.message)
  })
}
goBack(){
  this.location.back()
}
}
