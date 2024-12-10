import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from 'src/app/Services/customer.service';
import { ValidateForm } from 'src/app/helper/validateForm';
import { Location } from '@angular/common';
@Component({
  selector: 'app-agent-cust-document',
  templateUrl: './agent-cust-document.component.html',
  styleUrls: ['./agent-cust-document.component.css']
})
export class AgentCustDocumentComponent {
  @ViewChild('fileInput')
  fileInput!: ElementRef;
  selectedFile!: File;
  DocTypeForm!:FormGroup
  customerID:any
  documents:any
  headers: any
  currentPage:number=1
  pageSizes: number[] = [10, 20, 30];
  totalDocumentCount = 0;
  pageSize = this.pageSizes[0];
  constructor(private customer:CustomerService,private activatedroute:ActivatedRoute,private location:Location){}
  isEmployee=false
  isAdmin=false
  

  ngOnInit(){
    this.customerID = this.activatedroute.snapshot.paramMap.get('id');
    this.DocTypeForm=new FormGroup({
      docType:new FormControl('',[Validators.required])
    })
    this.getDocuments()
  }
  
 
  getDocuments(){
  
   
        this.customer.getCustomerDocuments(this.customerID,this.currentPage, this.pageSize).subscribe({
          next: (response) => {
    
            const paginationHeader = response.headers.get('X-Pagination');
              console.log(paginationHeader);
              const paginationData = JSON.parse(paginationHeader!);
               console.log(paginationData.TotalCount);
    
              this.totalDocumentCount=paginationData.TotalCount;
            this.documents = response.body;
            console.log(this.documents)
                 //this.updatePaginatedEmployees();
    
          }
        })
      }
      
    
  
  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  get pageCount(): number {
    return Math.ceil(this.totalDocumentCount / this.pageSize);
  }



  changePage(page: number) {
   
    this.currentPage = page;
    this.getDocuments();
  }
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  onPageSizeChange(event:Event){
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getDocuments();
  }
  downloadDocument(doc:any){
    this.customer.downloadFile(doc.documentId).subscribe((response) => {
      const contentDispositionHeader = response.headers.get('Content-Disposition');
      const fileName = contentDispositionHeader?.split(';')[1].split('filename=')[1].trim();

      if (response.body instanceof Blob && fileName) {
        // Create a Blob object from the response data
        const blob = new Blob([response.body], { type: response.body.type });

        // Trigger a file download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Response body is not a Blob.');
      }
    });
  }
  updateDocumentStatus(data:any){
    this.customer.updateCustomerDocuments(data.documentId).subscribe(
     (res)=>{
      alert("Updated Successfully");
      this.getDocuments();
     },
     (err)=>{
      alert("Something went wrong");
     }
    )
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

onSubmit(){
 let DocType=this.DocTypeForm.get('docType')?.value!
 debugger
 
 console.log(this.DocTypeForm.value)
 if (this.selectedFile && this.DocTypeForm.valid) {
  const formData = new FormData();
  formData.append('file', this.selectedFile);


   this.customer.uploadDocument(formData,this.customerID,DocType).subscribe(
    (data)=>{
      alert("Uploaded Successfully")
    },
    (err)=>{
      alert(err.message)
    }
   )

  // Reset the file input
  this.fileInput.nativeElement.value = '';
} else {
  ValidateForm.validateAllFormFileds(this.DocTypeForm)
  if(!this.selectedFile)
  {
  alert("No file selected")
  console.log('No file selected');
  }
  else{
    alert("select Document Type")
  }
 }
 
}
goBack(){
  this.location.back()
}
}