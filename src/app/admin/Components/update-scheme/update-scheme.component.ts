import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/Services/admin.service';
import { CustomerService } from 'src/app/Services/customer.service';
import { ValidateForm } from 'src/app/helper/validateForm';
import { Scheme } from 'src/app/models/Scheme';
import { SchemeDetails } from 'src/app/models/SchemeDetails';
import { Location } from '@angular/common';
@Component({
  selector: 'app-update-scheme',
  templateUrl: './update-scheme.component.html',
  styleUrls: ['./update-scheme.component.css']
})
export class UpdateSchemeComponent {
  scheme:Scheme=new Scheme()
  schemeId!:any
  schemeData!:any
  updateSchemeForm!: FormGroup;
  constructor(private activatedroute:ActivatedRoute,private admin:AdminService, private customer:CustomerService,private location:Location){}
  ngOnInit() {
    this.schemeId = (this.activatedroute.snapshot.paramMap.get('id'));
    // alert(this.schemeId);
    this.customer.getSchemeById(this.schemeId).subscribe({
      next:(res)=>{
        this.schemeData=res
        console.log(this.schemeData)
      },
      error:(err:HttpErrorResponse)=>{
        console.log(err)
      }
    })
    this.updateSchemeForm=new FormGroup({
      schemeName:new FormControl('',[Validators.required,ValidateForm.onlyCharactersValidator]),
      schemeImage:new FormControl(''),
      description:new FormControl('',[Validators.required,ValidateForm.onlyCharactersValidator]),
      minAmount:new FormControl('',[Validators.required,Validators.min(0)]),
      maxAmount:new FormControl('',[Validators.required]),
      minAge:new FormControl('',[Validators.required,Validators.min(1)]),
      maxAge:new FormControl('',[Validators.required,Validators.min(100)]),
      minInvestTime:new FormControl('',[Validators.required,Validators.min(1)]),
      maxInvestTime:new FormControl('',[Validators.required,Validators.max(50)]),
      profitRatio:new FormControl('',[Validators.required,Validators.min(0)]),
      registrationCommRatio:new FormControl('',[Validators.required,Validators.min(0)]),
      installmentCommRatio:new FormControl('',[Validators.required,Validators.min(0)]),
  
      planId:new FormControl('',[Validators.required])
    });
  }
  updateScheme() {
  console.log(this.updateSchemeForm.value)
  
    //  this.scheme.schemeId=this.schemeId;
    //  this.scheme.schemeName=this.updateSchemeForm.get('schemeName')!.value!
     this.scheme.planId=this.schemeData.body['planId'];
 
    //  this.scheme.schemeDetails=new SchemeDetails()
    
    //  this.scheme.schemeDetails.description=this.updateSchemeForm.get('description')!.value!
    //  this.scheme.schemeDetails.schemeImage=this.updateSchemeForm.get('schemeImage')!.value!
    //  this.scheme.schemeDetails.minInvestmentAmount=this.updateSchemeForm.get('minInvestmentAmount')!.value!
    //  this.scheme.schemeDetails.maxInvestmentAmount=this.updateSchemeForm.get('maxInvestmentAmount')!.value!
    //  this.scheme.schemeDetails.minAge=this.updateSchemeForm.get('minAge')!.value!

    //  this.scheme.schemeDetails.maxAge=this.updateSchemeForm.get('maxAge')?.value!
    //  this.scheme.schemeDetails.minTerm=this.updateSchemeForm.get('minTerm')?.value!
    //  this.scheme.schemeDetails.maxTerm=this.updateSchemeForm.get('maxTerm')?.value!
    //  this.scheme.schemeDetails.profitPercent=this.updateSchemeForm.get('profitPercent')?.value!
    //  this.scheme.schemeDetails.firstPremiumCommissionPercent=this.updateSchemeForm.get('firstPremiumCommissionPercent')?.value!
    //  this.scheme.schemeDetails.emiCommissionPercent=this.updateSchemeForm.get('emiCommissionPercent')?.value!
     console.log(this.scheme)
     this.admin.updateScheme(this.scheme).subscribe(
      {
        next:(res)=>{
          alert("Updated Successfully")
        },
        error:(err:HttpErrorResponse)=>{
          alert(err)
        }
      }
     )
    
    }
    goBack(){
      this.location.back()
    }
}
