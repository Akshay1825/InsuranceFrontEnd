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
  documents: any;
  selectedDocuments: string[] = [];
  constructor(private activatedroute:ActivatedRoute,private admin:AdminService, private customer:CustomerService,private location:Location){}
  ngOnInit() {
    this.documents = [
      { id: 'aadhar', value: 'AadharCard', label: 'Aadhar Card' },
      { id: 'pan', value: 'PanCard', label: 'PAN Card' },
      { id: 'voter', value: 'VoterId', label: 'Voter ID' },
      { id: 'passport', value: 'Passport', label: 'Passport' },
      { id: 'license', value: 'DrivingLicense', label: 'Driving License' },
      { id: 'passbook', value: 'BankPassbook', label: 'Bank Passbook' }
    ];
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
      requireddocuments:new FormControl(''),
      planId:new FormControl('',[Validators.required])
    });
  }

  onCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;
  
    if (checkbox.checked) {
      this.selectedDocuments.push(value);
    } else {
      this.selectedDocuments = this.selectedDocuments.filter(doc => doc !== value);
    }
  
    console.log(this.selectedDocuments);
    this.updateSchemeForm.get('requireddocuments')?.setValue(this.selectedDocuments);
  }
  updateScheme() {
  console.log(this.updateSchemeForm.value)
  const newData = {
    schemeId: this.schemeId,
    schemeName: this.updateSchemeForm.get('schemeName')!.value!,
    planId: this.schemeData.body['planId'],
    description: this.updateSchemeForm.get('description')!.value!,
    // schemeImage: this.updateSchemeForm.get('schemeImage')!.value!,
    minAmount: this.updateSchemeForm.get('minAmount')!.value!,
    maxAmount: this.updateSchemeForm.get('maxAmount')!.value!,
    minAge: this.updateSchemeForm.get('minAge')!.value!,
    maxAge: this.updateSchemeForm.get('maxAge')?.value!,
    minInvestTime: this.updateSchemeForm.get('minInvestTime')?.value!,
    maxInvestTime: this.updateSchemeForm.get('maxInvestTime')?.value!,
    profitRatio: this.updateSchemeForm.get('profitRatio')?.value!,
    registrationCommRatio: this.updateSchemeForm.get('registrationCommRatio')?.value!,
    installmentCommRatio: this.updateSchemeForm.get('installmentCommRatio')?.value!,
    requireddocuments:this.selectedDocuments
  };
     console.log(newData)
     this.admin.updateScheme2(newData).subscribe(
      {
        next:(res)=>{
          console.log(res);
          alert("Updated Successfully")
        },
        error:(err:HttpErrorResponse)=>{
          console.log(err);
        }
      }
     )
    
    }
    goBack(){
      this.location.back()
    }
}
