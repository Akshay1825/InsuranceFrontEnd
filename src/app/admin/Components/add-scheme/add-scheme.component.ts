import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/Services/admin.service';
import { ValidateForm } from 'src/app/helper/validateForm';
import { Location } from '@angular/common';
import { AbstractControl } from '@angular/forms';
import { ValidatorFn, FormBuilder } from '@angular/forms';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-add-scheme',
  templateUrl: './add-scheme.component.html',
  styleUrls: ['./add-scheme.component.css']
})
export class AddSchemeComponent implements OnInit {
  addSchemeForm!: FormGroup;
  planId!: any;
  documentTypes: string[] = [];
  documents: any[] = [];
  selectedDocuments: string[] = [];
  status: any;

  constructor(
    private router:Router,
    private admin: AdminService,
    private fb: FormBuilder,
    private activatedroute: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    // Fetching document types
    this.documents = [
      { id: 'aadhar', value: 'AadharCard', label: 'Aadhar Card' },
      { id: 'pan', value: 'PanCard', label: 'PAN Card' },
      { id: 'voter', value: 'VoterId', label: 'Voter ID' },
      { id: 'passport', value: 'Passport', label: 'Passport' },
      { id: 'license', value: 'DrivingLicense', label: 'Driving License' },
      { id: 'passbook', value: 'BankPassbook', label: 'Bank Passbook' }
    ];

    // Fetching document types from the backend service
    this.admin.getDocumentTypes().subscribe((data) => {
      this.documentTypes = data.body;
      console.log(this.documentTypes);
      this.populateDocuments();
    });

    // Retrieving planId from the route snapshot
    this.planId = this.activatedroute.snapshot.paramMap.get('id');

    // Initializing the form group
    this.addSchemeForm = this.fb.group(
      {
        schemeName: [
          '',
          [
            Validators.required,
            ValidateForm.onlyCharactersValidator,
            this.checkDuplicateSchemeName.bind(this) 
          ]
        ],
        schemeImage: [''],
        description: ['', [Validators.required, ValidateForm.onlyCharactersValidator]],
        minAmount: ['', [Validators.required, Validators.min(1),ValidateForm.integer]],
        maxAmount: ['', [Validators.required, Validators.min(1),ValidateForm.integer]],
        minAge: ['', [Validators.required, Validators.min(1), Validators.max(60),ValidateForm.integer]],
        maxAge: ['', [Validators.required, Validators.min(1), Validators.max(100),ValidateForm.integer]],
        minInvestTime: ['', [Validators.required, Validators.min(1),ValidateForm.integer]],
        maxInvestTime: ['', [Validators.required, Validators.min(1),ValidateForm.integer]],
        profitRatio: ['', [Validators.required, Validators.min(0)]],
        registrationCommRatio: ['', [Validators.required, Validators.min(0)]],
        installmentCommRatio: ['', [Validators.required, Validators.min(0)]],
        requireddocuments: [''],
        planId: [this.planId, [Validators.required]] 
      },
      {
        validators: [
          this.minMaxValidator('minAmount', 'maxAmount'),
          this.minMaxValidator('minAge', 'maxAge'),
          this.minMaxValidator('minInvestTime', 'maxInvestTime')
        ]
      }
    );

    // Value changes subscription for checking duplicate scheme name
    this.addSchemeForm
      .get('schemeName')
      ?.valueChanges.pipe(
        debounceTime(1000), // Wait for 500ms after the user stops typing
        switchMap((schemeName) => this.checkDuplicateSchemeName(schemeName)),
        catchError((err) => of(false)) // Handle error by returning false if something fails
      )
      .subscribe((isDuplicate) => {
        console.log(isDuplicate);
        this.status = isDuplicate;
        if (isDuplicate.body.exists) {
          this.addSchemeForm.get('schemeName')?.setErrors({ duplicateSchemeName: true });
        } else {
          this.addSchemeForm.get('schemeName')?.setErrors(null);
        }
      });
  }

  // Getter for documents form array
  get documentsFormArray(): FormArray {
    return this.addSchemeForm.get('documents') as FormArray;
  }

  // Custom validator to compare min and max values
  minMaxValidator(minField: string, maxField: string) {
    console.log(minField);
    console.log(maxField);
    return (formGroup: FormGroup): { [key: string]: boolean } | null => {
      const minControl = formGroup.get(minField);
      const maxControl = formGroup.get(maxField);
  
      // Ensure both controls exist and have valid values
      if (minControl && maxControl && minControl.value != null && maxControl.value != null) {
        if (minControl.value >= maxControl.value) {
          
          return { [`${minField}GreaterThanMax`]: true };
          this.addSchemeForm.get('schemeName')?.setErrors({ duplicateSchemeName: true })
        }
      }
      return null; // Validation passes
    };
  }

  // Checkbox change handler to update selected documents
  onCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const value = checkbox.value;

    if (checkbox.checked) {
      this.selectedDocuments.push(value);
    } else {
      this.selectedDocuments = this.selectedDocuments.filter((doc) => doc !== value);
    }

    console.log(this.selectedDocuments);
    this.addSchemeForm.get('requireddocuments')?.setValue(this.selectedDocuments);
  }

  // Method to populate document types
  loadDocumentTypes(): void {
    setTimeout(() => {
      this.documentTypes = [
        'Identity Proof',
        'Address Proof',
        'Income Proof',
        'Photo'
      ]; // Replace with actual enum data
    }, 1000);
  }

  // Populate form array with document types
  populateDocuments(): void {
    this.documentTypes.forEach(() =>
      this.documentsFormArray.push(new FormControl(false))
    );
  }

  // Add scheme method
  addScheme() {
    if (this.addSchemeForm.valid)
    {
      this.admin.addSchemeWithDetail(this.addSchemeForm.value).subscribe(
        (res) => {
          alert('Added Successfully');
          console.log(res);
          this.router.navigate(['/admin/viewPlan']); // Redirect to schemes page if successful
          // location.reload()
        },
        (err: HttpErrorResponse) => {
          alert('Something Went Wrong');
        }
      );
    }
    else
    alert("Please Follow the Instructions Given Below")
  }

  // Go back to the previous page
  goBack() {
    this.location.back();
  }

  // Custom validator to check if the scheme name already exists
  checkDuplicateSchemeName(schemeName: string) {
    if (!schemeName) {
      return of(false); // Return false if scheme name is empty
    }
    return this.admin.checkSchemeNameDuplicate(schemeName).pipe(
      catchError(() => of(false)) // Return false if the backend request fails
    );
  }
}
