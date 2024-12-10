import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CustomerService } from 'src/app/Services/customer.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-customer-document',
  templateUrl: './customer-document.component.html',
  styleUrls: ['./customer-document.component.css']
})
export class CustomerDocumentComponent {


  customerID: any
  documents: any=[]
  headers: any
  currentPage: number = 1
  pageSizes: number[] = [5, 10, 20, 30];
  totalDocumentCount = 0;
  pageSize = this.pageSizes[0];
  constructor(private customer: CustomerService, private activatedroute: ActivatedRoute,private location:Location) { }
  isEmployee = false
  isAdmin = false
  jwtHelper = new JwtHelperService()


  ngOnInit() {
    this.customerID = this.activatedroute.snapshot.paramMap.get('id');
    const decodedToken = this.jwtHelper.decodeToken(localStorage.getItem('token')!);

    const role: string = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if (role === 'Employee') {
      this.isEmployee = true
    }
    else {
      this.isAdmin = true
    }
    this.getDocuments()
  }

goBack(){
  this.location.back()
}
  getDocuments() {


    this.customer.getCustomerDocuments(this.customerID, this.currentPage, this.pageSize).subscribe({
      next: (response) => {

        const paginationHeader = response.headers.get('X-Pagination');
        console.log(paginationHeader);
        const paginationData = JSON.parse(paginationHeader!);
        console.log(paginationData.TotalCount);

        this.totalDocumentCount = paginationData.TotalCount;
        this.documents = response.body;

        //this.updatePaginatedEmployees();

      },
      error: (err: HttpErrorResponse) => {
      console.log(err.error.Message)
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
  onPageSizeChange(event: Event) {
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getDocuments();
  }
  downloadDocument(doc: any) {
    this.customer.downloadFile(doc.documentId).subscribe((fileUrl: string) => {
        if (fileUrl) {
            const a = document.createElement('a');
            a.href = doc.filePath;
            a.download = ''; // You can optionally extract the filename from the URL if needed
            a.target = '_blank'; // Optional: Open in a new tab
            a.click();

            console.log('Download triggered for URL:', doc.filePath);
        } else {
            console.error('File URL is empty.');
        }
    }, error => {
        console.error('Error downloading file:', error);
    });
}
  updateDocumentStatus(data: any) {
    this.customer.updateCustomerDocuments(data.documentId).subscribe(
      (res) => {
        alert("Updated Successfully");
        location.reload()
      },
      (err) => {
        alert("Something went wrong");

      }
    )
  }

}
