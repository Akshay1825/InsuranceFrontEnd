import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AgentService } from 'src/app/Services/agent.service';
import { CustomerService } from 'src/app/Services/customer.service';
import { ValidateForm } from 'src/app/helper/validateForm';
import { NomineeDTO } from 'src/app/models/NomineeDTO';
import { Policy } from 'src/app/models/Policy';
import { Location } from '@angular/common';
import { AdminService } from 'src/app/Services/admin.service';
import { Router } from '@angular/router';
declare var window: any
@Component({
  selector: 'app-register-policy',
  templateUrl: './register-policy.component.html',
  styleUrls: ['./register-policy.component.css']
})
export class RegisterPolicyComponent {
  policyRegistrationForm!: FormGroup
  nomineeForm!: FormGroup
  iPlans: any = {};
  iplan: any
  arr: number[] = new Array();  
  selectedValue:any;
  selectedValue2:any;
  agentData: any = {}
  iSchemes: any = {};
  schemeDetail: any = {}
  isNominee = false
  isSubmitted = false
  newCustomer: any;
  totalPremiumEMI!: number;
  premium!: number;
  policy: Policy = new Policy()
  MaturityAmount: any;
  isNomineeAdded: boolean = false
  customerData: any = {}
  selectedValue3:any;
  showDetailModal: any
  constructor(private customer: CustomerService,private router:Router,private admin:AdminService, private agent: AgentService,private location:Location) { }
  ngOnInit() {
    this.policyRegistrationForm = new FormGroup({
      planName: new FormControl('', [Validators.required]),
      schemeName: new FormControl('', [Validators.required]),
      userName: new FormControl('', [Validators.required]),
      premiumType: new FormControl('', [Validators.required]),
      term: new FormControl('', [Validators.required]),
      sumAssured: new FormControl('', [Validators.required, Validators.min(0)]),

    })
    this.nomineeForm = new FormGroup({
      nominee: new FormControl('', ),
      nomineeRelation: new FormControl('', ),
    })
    this.showDetailModal = new window.bootstrap.Modal(document.getElementById("RegisterModal"));
    this.customer.getAllPlan().subscribe({
      next: (data) => {
        console.log(data)
        this.iPlans = data
      },
      error: (err: HttpErrorResponse) => 
        {
        console.log(err)
      }
    });
    this.getCustomers()
  }
  getCustomers() {
    this.agent.getAgentByUserName().subscribe({
      next: (res) => {
        this.agentData = res
        console.log(this.agentData.body)
        this.GetCustomersByAgentId() 
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    })
  }

  GetCustomersByAgentId() 
  { 
    this.agent.getCustomerByAgentId(this.agentData.body.customer['id']).subscribe({
      next: (res) => {
        this.customerData = res.body;
        console.log(this.customerData)
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    })
  }

  onSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedValue = selectElement.value; 
    console.log('Selected option value: ' + this.selectedValue);
    this.admin.getSchemesByPlanID(this.selectedValue).subscribe(
      (res) => {
        console.log(res);
        this.iplan = res;
        this.iSchemes = res.body;
        console.log(this.iSchemes);
      },
      (err) => {
        console.log(err);
      }
    )

  }

  onSchemeSelection(event: Event): void {
    // this.customercount[] = 
    // console.log(this.agentData.body.customer.customerCount.value)
     this.arr.length = this.agentData.body.customer['customerCount'];
    const selectElement = event.target as HTMLSelectElement;
    this.selectedValue2 = selectElement.value;
    console.log('Selected option value: ' + this.selectedValue2);
    this.customer.getDetail(this.selectedValue2).subscribe(
      (res) => {
        this.schemeDetail = res;

        console.log(this.schemeDetail);
      },
      (err) => {
        console.log(err);
      }
    )
  }
  onCustomerSelection(event: Event) {
    const selectedUserName = (event.target as HTMLSelectElement).value;
    console.log('Selected userName: ', selectedUserName);
    this.customer.getCustomerProfile2(selectedUserName).subscribe({
      next:(res)=>{
        console.log(res);
        this.newCustomer=res.body;
        console.log(this.newCustomer);
      },
      error:(err:HttpErrorResponse)=>{
        console.log(err.error.Message);
      }
    })
   
    // this.customerData = this.agentData.customers.find((object: any) => object.customerId == selectedValue)
    console.log( this.customerData  );

  }
  showNominee() {
    
    this.isNominee = true;
  }
  onSubmit() {

    console.log(this.nomineeForm.value);
    if (this.nomineeForm.valid) {
      this.isSubmitted = true
      console.log(this.nomineeForm.value)

      this.policy.nominee = this.nomineeForm.get('nominee')?.value!
      this.policy.nomineeRelation = this.nomineeForm.get('nomineeRelation')?.value!
      alert("Added Successfully")
      this.isNominee = true;
    }
    else {
      ValidateForm.validateAllFormFileds(this.nomineeForm)
      alert("one or more fields are required");

    }
    this.nomineeForm.reset();

  }
  onCancel() {
    this.nomineeForm.reset()
    this.isNominee = false
  }
  checkRange(minValue: number, maxValue: number, value: number) {
    if (value >= minValue && value <= maxValue) {
      return true;
    } else {
      return false;
    }
  }
  calculateModeMultiplier() {
    let modeMultiplier = 1;
    switch (this.policyRegistrationForm.get('premiumType')!.value) {
      case 'Monthly':
        modeMultiplier = 12;
        this.policy.premiumType = 3;

        break;
      case 'Quaterly':
        modeMultiplier = 4;
        this.policy.premiumType = 2;
        break;
      case 'Half Yearly':
        modeMultiplier = 2;
        this.policy.premiumType = 1;
        break;
    }
    return modeMultiplier;

  }
  fillPolicy() {
   // this.customerData = this.agentData.customers.find((object: any) => object.customerId == this.policyRegistrationForm.get('customerId')!.value)
    if (this.checkRange(this.schemeDetail.body['minInvestTime'], this.schemeDetail.body['maxInvestTime'], this.policyRegistrationForm.get('term')!.value) &&
      this.checkRange(this.schemeDetail.body['minAmount'], this.schemeDetail.body['maxAmount'], this.policyRegistrationForm.get('sumAssured')!.value)) {

      let modeMultiplier = this.calculateModeMultiplier();

      this.totalPremiumEMI = (modeMultiplier * this.policyRegistrationForm.get('term')!.value)
      this.premium = Math.round((this.policyRegistrationForm.get('sumAssured')!.value) / (this.totalPremiumEMI) * 100) / 100;

      const sumAssured = this.policyRegistrationForm.get('sumAssured')!.value;
      this.MaturityAmount = sumAssured + sumAssured * this.schemeDetail.body['profitRatio'] / 100;

      //policy object
      this.policy.insuranceSchemeId = this.schemeDetail.body['schemeId'];
      this.policy.issueDate = new Date();

      // Calculate MaturityDate
      const termInYears = this.policyRegistrationForm.get('term')!.value;
      const maturityDate = new Date(this.policy.issueDate);
      maturityDate.setFullYear(maturityDate.getFullYear() + termInYears);

      this.policy.maturityDate = maturityDate;
      this.policy.premiumAmount = this.premium
      this.policy.sumAssured = this.MaturityAmount
      this.policy.totalPremiumNumber = this.totalPremiumEMI
      this.policy.investmentAmount = this.policyRegistrationForm.get('sumAssured')!.value
      this.policy.customerId= this.newCustomer.customer['customerId'],
      this.policy.schemeName = this.schemeDetail.body['schemeName'];

      this.policy.agentId = this.agentData.body.customer['id'];
      console.log(this.policy)
      this.openModal();

    }
    else {
      alert("Invalid Term/SumAssured")
    }
  }


  calculatePremium() {
    if (this.policyRegistrationForm.valid || (this.isNominee && this.policy.nomineeRelation != null && this.policy.nominee != null)) {
      //const scheme = this.planSchemes.find((object) => object.schemeId == this.premiumCalculateForm.get('schemeName')!.value)
      if (this.isNominee) {
        if (this.isSubmitted) {
          this.fillPolicy()
        }
        else
          alert("one ore more fields are required");

      }
      else {
        this.fillPolicy()
      }


    }
    else {
      ValidateForm.validateAllFormFileds(this.policyRegistrationForm)

      alert("one or more field required")

    }
  }

  checkValidity(minValue: number, maxValue: number) {
    const birthdate = new Date(this.newCustomer.customer['birthDate']);
    console.log(birthdate)
    const currentDate = new Date();
    // Calculate age in years
    const ageInMilliseconds = currentDate.getTime() - birthdate.getTime();
    const ageInYears = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25));
    console.log(ageInYears)
    if (ageInYears >= minValue && ageInYears <= maxValue) {
      return true;
    } else {
      return false;
    }
  }
  checkDocuments() {
    if (this.newCustomer.documents.length < 3 ||this.customerData.documents ==null) {
      return false
    }
    return true
  }
  applyPolicy() {
    if (this.checkValidity(this.schemeDetail.body['minAge'], this.schemeDetail.body['maxAge'])) {
      if (true) {
        this.customer.setPolicy(this.policy)
        console.log(this.policy)
        this.RegisterPolicy()
      }
      else {
        alert("Upload Documents First")
      }

    }
    else {
      alert("You are not eligible")


    }
    this.policyRegistrationForm.reset()

  }
  CancelRegistration() {
    this.policyRegistrationForm.reset();
  }
  RegisterPolicy() {

    this.customer.purchasePolicy(this.policy).subscribe(
      {
        next: (res) => {
          alert("Applied Successfully");
          this.closeModal();
          this.router.navigateByUrl('/agent');
        },
        error: (err) => {
          console.log(err);
          alert("Something went wrong!");
          this.closeModal();
        }
      }
    )
  }
  openModal() {
    this.showDetailModal.show()
  }
  closeModal() {
    this.showDetailModal.hide()
  }
  goBack():void{
    this.location.back();
  }
}
