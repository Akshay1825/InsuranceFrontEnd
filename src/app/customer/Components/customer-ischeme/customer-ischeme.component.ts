import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'src/app/Services/customer.service';
import { forkJoin } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Policy } from 'src/app/models/Policy';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidateForm } from 'src/app/helper/validateForm';
import { AdminService } from 'src/app/Services/admin.service';

@Component({
  selector: 'app-customer-ischeme',
  templateUrl: './customer-ischeme.component.html',
  styleUrls: ['./customer-ischeme.component.css']
})
export class CustomerIschemeComponent {
  planId!: string

  planSchemes: any[] = []
  premiumCalculateForm!: FormGroup
  premium!: number
  totalPremiumEMI!: number
  isDisabled: boolean = false
  MaturityAmount!: number
  policy: Policy = new Policy()
  policyModal: any
  customerProfile: any
  minTerm :any;
  maxTerm :any;
  isDecimalError :any;
  isRangeError :any;
  minimumAmount: any;
  maximumAmount: any;
  isAmountDecimalError: any;
  constructor(private activatedroute: ActivatedRoute,private admin:AdminService, private customer: CustomerService, private router: Router) {

  }

  ngOnInit() {
    const planIdString = this.activatedroute.snapshot.paramMap.get('id');
    if (planIdString) {
    this.planId = planIdString; // Use as string
     console.log(`Retrieved Plan ID: ${this.planId}`);
     } 

    this.getSchemes()

    this.premiumCalculateForm = new FormGroup(
      {
        schemeName: new FormControl('', [Validators.required]),
        premiumType: new FormControl('', [Validators.required]),
        term: new FormControl('', [Validators.required,]),
        sumAssured: new FormControl('', [Validators.required,Validators.min(0)])
      },


    );
    this.getCustomerProfle()

  }

  getCustomerProfle() {
    this.customer.getCustomerProfile().subscribe({
      next: (res) => {
        this.customerProfile = res;
        console.log(this.customerProfile)
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }

    })
  }

  getSchemes() {
    this.admin.getSchemesByPlanID(this.planId).subscribe((res) => {
      const schemes = res.body; // Adjust this according to the actual property
      if (!schemes || !Array.isArray(schemes)) {
        console.error('Schemes data is missing or not an array:', res);
        return;
      }
  
      const schemeIds = schemes.map((scheme: any) => scheme.schemeId);
      forkJoin(schemeIds.map((schemeId: any) => this.customer.getDetail(schemeId))).subscribe(
        (detailsArray: any) => {
          const planSchemes = schemes.map((scheme: any, index: number) => {
            const details = detailsArray[index];
            return { ...scheme, additionalDetail: details };
          });
          this.planSchemes = planSchemes;
          console.log(this.planSchemes);
          console.log(this.planSchemes[1].requireddocuments);
        },
        (error) => {
          console.error('Error fetching additional scheme details:', error);
        }
      );
    },
    (error) => {
      console.error('Error fetching schemes:', error);
    });
  }
  checkRange(minValue: number, maxValue: number, value: number) {
    if (value >= minValue && value <= maxValue) {
      return true;
    } else {
      return false;
    }
  }

  calculatePremium() {

    if (this.premiumCalculateForm.valid && !this.isDecimalError && !this.isAmountDecimalError) {
      const scheme = this.planSchemes.find((object) => object.schemeId == this.premiumCalculateForm.get('schemeName')!.value)
      this.minTerm = scheme.minInvestTime;
      this.maxTerm = scheme.maxInvestTime;
      this.minimumAmount = scheme.minAmount;
      this.maximumAmount = scheme.maxAmount;
      console.log(this.minTerm, this.maxTerm);
      if (this.checkRange(scheme.minInvestTime, scheme.maxInvestTime, this.premiumCalculateForm.get('term')!.value)){
        if(this.checkRange(scheme.minAmount, scheme.maxAmount, this.premiumCalculateForm.get('sumAssured')!.value)){
        let modeMultiplier = 1;
        switch (this.premiumCalculateForm.get('premiumType')!.value) {
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

        this.totalPremiumEMI = (modeMultiplier * this.premiumCalculateForm.get('term')!.value)
        this.premium = Math.round((this.premiumCalculateForm.get('sumAssured')!.value) / (this.totalPremiumEMI) * 100) / 100;

        console.log(scheme)
        console.log(scheme.profitRatio)
        const sumAssured = this.premiumCalculateForm.get('sumAssured')!.value;
        this.MaturityAmount = sumAssured + sumAssured * scheme.profitRatio / 100;
        console.log(this.premium);
        console.log(this.MaturityAmount)
        //policy object
        this.policy.insuranceSchemeId = scheme.schemeId
        this.policy.issueDate = new Date();

        // Calculate MaturityDate
        const termInYears = this.premiumCalculateForm.get('term')!.value;
        const maturityDate = new Date(this.policy.issueDate);
        maturityDate.setFullYear(maturityDate.getFullYear() + termInYears);

        this.policy.maturityDate = maturityDate;
        this.policy.premiumAmount = this.premium
        this.policy.sumAssured = this.MaturityAmount
        this.policy.totalPremiumNumber = this.totalPremiumEMI
        this.policy.investmentAmount = this.premiumCalculateForm.get('sumAssured')!.value
        this.policy.customerId = this.customerProfile.customer['customerId']
        this.isDisabled = true;

      }
      else {
        alert(`Please Enter Investment Amount Between ${this.minimumAmount} and ${this.maximumAmount} .`);
        
      }}
      else {
        
        alert(`Please Enter Investment Time Between ${this.minTerm} and ${this.maxTerm} years.`);
      }

    }
    else {
      ValidateForm.validateAllFormFileds(this.premiumCalculateForm)
      alert("Please Enter Details correctly")
    }
  }

  validateTerm(): void {
    const termControl = this.premiumCalculateForm.get('term');
    const amountControl = this.premiumCalculateForm.get('sumAssured');
    if (termControl) {
      const value = termControl.value;

      // Reset errors
      this.isDecimalError = false;
      this.isRangeError = false;

      // Check for decimal values
      if (value && value % 1 !== 0) {
        this.isDecimalError = true;
        return;
      }

      // Check for min/max range
      if (value < this.minTerm || value > this.maxTerm) {
        this.isRangeError = true;
        return;
      }
    }

    if(amountControl)
    {
      const value = amountControl.value;
      this.isAmountDecimalError = false;
      if (value && value % 1 !== 0) 
      {
        this.isAmountDecimalError = true;
        return;
      }
    }
  }
  checkValidity(minValue: number, maxValue: number) {
    const birthdate = new Date(this.customerProfile.customer['birthDate']);
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
  checkDocuments(){
    console.log(this.customerProfile.customer['documents']);
    if (this.customerProfile.customer['documents'] && this.customerProfile.customer['documents'].length < 3) {
      return false;
    }
    return true;
  }
  applyPolicy() {
    const scheme = this.planSchemes.find((object) => object.schemeId == this.premiumCalculateForm.get('schemeName')!.value)
    console.log(scheme);
    if (this.checkValidity(scheme.minAge, scheme.maxAge)) {
      if(this.checkDocuments())
      {
        this.customer.setPolicy(this.policy)
        console.log(this.policy)
        this.router.navigateByUrl('/customer/buyPolicy');
      }
      else{
        alert("Upload Documents First!");
        this.isDisabled = false
      }
    }
    else {
      alert("You are not eligible")
      this.isDisabled = false
    }
    this.premiumCalculateForm.reset()
  }
}
