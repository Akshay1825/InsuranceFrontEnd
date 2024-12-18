import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomerService } from 'src/app/Services/customer.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-documentupload',
  templateUrl: './documentupload.component.html',
  styleUrls: ['./documentupload.component.css']
})
export class DocumentuploadComponent implements OnInit {
  jwtHelper = new JwtHelperService()
  file: any | null = null; 
  documentTypes: any;

  newDocument = new FormGroup({
    Newname: new FormControl(),
    filePath: new FormControl(),
    customerId: new FormControl()
  })
  customerProfile: any;
  name: any;
  schemeId: any;
  schemeDetails: any;
  uploadStatus: string | undefined;
  showUploadSuccess: boolean | undefined;

constructor(private http: HttpClient,private router:Router,private route:ActivatedRoute,private customer:CustomerService) {}

ngOnInit(): void {
  const decodedToken= this.jwtHelper.decodeToken(localStorage.getItem('token')!);
  const role: string = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  this.getCustomer();

  this.route.queryParams.subscribe(params => {
    // Check which parameter is passed and assign appropriately
    if (params['schemeId']) {
      this.schemeId = params['schemeId'];
      console.log('Scheme ID:', this.schemeId);
      this.handleSchemeId(); // Handle scheme-specific logic
    } else if (params['name']) {
      this.name = params['name'];
      console.log('Document Name:', this.name);
      this.handleDocumentName(); // Handle name-specific logic
    } else {
      console.error('No valid query parameter passed.');
      alert('Invalid navigation. Please try again.');
    }
  });
}
  handleDocumentName() {
    this.documentTypes = this.name;
    
  }
  handleSchemeId(): void {
    if (!this.schemeId) {
      console.error('Scheme ID is missing.');
      alert('No Scheme ID provided. Unable to fetch scheme details.');
      return;
    }
  
    this.customer.getSchemeById(this.schemeId).subscribe({
      next: (res) => {
        if (!res) {
          console.error('No scheme data found for the provided Scheme ID.');
          alert('Scheme not found. Please check the Scheme ID and try again.');
          return;
        }
        console.log('Scheme details retrieved successfully:', res);
        this.schemeDetails = res.body;
        this.documentTypes = this.schemeDetails.requireddocuments;
      },
      error: (err) => {
        console.error('Error while fetching scheme details:', err);
        alert('Failed to retrieve scheme details. Please try again later.');
      },
      complete: () => {
        console.log('Scheme retrieval process completed.');
      },
    });
  }
  
 getCustomer(){
  this.customer.getCustomerProfile().subscribe({
    next: (res) => {
      console.log(res);
      this.customerProfile = res;
  
      if (!res) {
        console.error('Customer profile is invalid or missing customerId');
        alert('Failed to retrieve customer profile. Please try again.');
        return;
      } 
    },
    error: (err) => {
      console.error('Failed to retrieve customer profile:', err);
      alert('An error occurred while retrieving customer profile. Please try again later.');
    },
    complete: () => {
      console.log('Customer profile retrieval completed.');
    }
  });
 }
  onSelect(event: any) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const selectedFile = input.files[0];
      const maxSize = 5 * 1024 * 1024; // 5 MB

      // Validate file size
      if (selectedFile.size > maxSize) {
        alert('File size exceeds 5 MB');
        return;
      }

      // Validate file type
      if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
        alert('Invalid file type. Only JPEG and PNG are allowed.');
        return;
      }

      this.file = selectedFile;
    }
  }

  upload(): void {
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('upload_preset', 'sample_preset'); // Replace with your preset
    // No need for Authorization header!
  
    fetch('https://api.cloudinary.com/v1_1/dxq7e2s2v/image/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Upload successful:', data);

        console.log(this.newDocument.get('Newname'));

        const documentName = this.name || this.newDocument.controls['Newname'].value;

        this.http.post('https://localhost:7117/api/Document',{filePath :data.url,customerId:this.customerProfile.customer['customerId'],
          name:documentName 
        }).subscribe({
          next: (res) => {
            this.uploadStatus = `${documentName} uploaded successfully!`;
            this.showUploadSuccess = true; 
          },
          error: (err) => {
            console.error('Database error:', err);
            this.uploadStatus = 'Document upload failed. Please try again.';
            this.showUploadSuccess = false;
          },
        });
      })
      .catch((error) => console.error('Cloudinary upload error:', error));
  }

  goToDocumentsPage(): void {
    this.router.navigateByUrl('customer/documents'); // This will navigate to your documents page
  }
  onRemove() {
    this.file = null;
  }
}
