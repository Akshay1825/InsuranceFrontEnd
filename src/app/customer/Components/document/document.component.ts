
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Location } from '@angular/common';
import { CustomerService } from 'src/app/Services/customer.service';
import { ValidateForm } from 'src/app/helper/validateForm';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent {
  @ViewChild('fileInput')
  fileInput!: ElementRef;
  selectedFile!: File;
  fileUrl: string="";
  customerProfile:any
  documents:any
  headers: any
  currentPage:number=1
  pageSizes: number[] = [10, 20, 30];
  totalDocumentCount = 0;
  pageSize = this.pageSizes[0];
  newName: any;
  newUploadedDocuments:any;
  constructor(private customer:CustomerService,private router:Router,private location:Location,private http:HttpClient){}
  DocTypeForm!:FormGroup
  jwtHelper=new JwtHelperService()
  isAgent=false
  isCustomer=false
  ngOnInit(){
    const decodedToken= this.jwtHelper.decodeToken(localStorage.getItem('token')!);

    const role: string = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if(role==='CUSTOMER')
    {
     this.isCustomer=true
    }
    else{
     this.isAgent=true
    }
  
  
    this.DocTypeForm=new FormGroup({
      docType:new FormControl('',[Validators.required])
    })
    this.getDocuments()

    this.customer.getDocumentType().subscribe({
      next: (types) => {
        console.log(types);
        this.documentTypes = types;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

 
  getDocuments() {
    this.customer.getCustomerProfile().subscribe({
      next: (res) => {
        console.log(res);
        if (!res ) {

          console.error('Customer profile is invalid or missing customerId');
          alert('Failed to retrieve customer profile. Please try again.');
          return;
        }
  
        this.customerProfile = res;
        
        // Fetch documents using the retrieved customer ID
        this.customer.getCustomerDocuments(this.customerProfile.customer['customerId'], this.currentPage, this.pageSize).subscribe({
          next: (response) => {
            if (!response) {
              this.newUploadedDocuments = response;
              console.warn('Document response is empty');
              // if (!Array.isArray(this.newUploadedDocuments) || this.newUploadedDocuments.length === 0) {
              //   alert("No Documents Found");
              //   this.goBack();
              //   return;
              // }
              this.documents = [];
              return;
            }
  
            // Handle pagination header
            const paginationHeader = response.headers?.get('X-Pagination');
            if (paginationHeader) {
              try {
                const paginationData = JSON.parse(paginationHeader);
                console.log('Pagination data:', paginationData);
  
                this.totalDocumentCount = paginationData.TotalCount;
                this.currentPage = paginationData.CurrentPage;
                this.pageSize = paginationData.PageSize;
              } catch (error) {
                console.error('Error parsing X-Pagination header:', error);
                alert('Error processing pagination data. Please try again.');
                return;
              }
            } else {
              console.warn('X-Pagination header is missing in the response');
            }
  
            // Assign documents or fallback to empty array
            this.documents = response.body || [];
            
            console.log('Documents:', this.documents);
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error fetching documents:', err);
            alert(`Failed to fetch documents: ${err.message || 'Unknown error'}`);
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching customer profile:', err);
        alert(`Failed to fetch customer profile: ${err.message || 'Unknown error'}`);
      }
    });
  }
  
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  
  downloadDocument(doc: any) {
    console.log(doc);
    const fileUrl = doc.filepath; // Use the URL from the database (doc.filepath)
    
    console.log(doc.filePath);
    if (doc.filePath) {
        // Create a link to download the file
        const a = document.createElement('a');
        a.href = doc.filePath; // Use the file URL from your database
        a.download = ''; // Optional: You can set a filename if needed
        a.target = '_blank'; // Optional: Open in a new tab
        a.click();

        console.log('Download triggered for URL:', fileUrl);
    } else {
        console.error('File URL is empty.');
    }

}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  file: any | null = null; 
  documentTypes: any;

  newDocument = new FormGroup({
    name: new FormControl(),
    filePath: new FormControl(),
    customerId: new FormControl()
  })

  

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

  onRemove() {
    this.file = null;
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
        // this.customerSignUpForm.get('agentId')?.setValue(this.agentProfile.agent['agentId']);
        // this.newDocument.get
        console.log(this.newDocument.get('name'));
        this.http.post('https://localhost:7117/api/Document',{filePath :data.url,customerId:this.customerProfile.customer['customerId'],
          name:this.newDocument.controls['name'].value
        }).subscribe({
          next: (res) => 
            alert("Document Uploaded Successfully"),
            
          error: (err) => console.error('Database error:', err),
        });
      })
      .catch((error) => console.error('Cloudinary upload error:', error));
  }

  updateDocumentStatus(data: any) {
    console.log(data);
    // Pass 'data' to the PUT request body to update the document
    this.http.put("https://localhost:7117/api/Document", data).subscribe(
      (res) => {
        alert("Updated Successfully");
        this.getDocuments();// Refresh the page after the update
      },
      (err) => {
        alert("Something went wrong");
        console.error(err); // Log error for debugging
      }
    );
  }

  reuploadDocument(i:any)
{
  this.router.navigate(['/document-upload'], { queryParams: { name: this.documents[i].name } })
  this.documents[i].name
}
goBack(){
  this.location.back()
}

}
