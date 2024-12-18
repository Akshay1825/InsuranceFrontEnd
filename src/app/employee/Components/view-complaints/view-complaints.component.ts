import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Location } from '@angular/common';
import { EmployeeService } from 'src/app/Services/employee.service';
declare var window:any
@Component({
  selector: 'app-view-complaints',
  templateUrl: './view-complaints.component.html',
  styleUrls: ['./view-complaints.component.css']
})
export class ViewComplaintsComponent {
isEmployee=false
isSearch:boolean=false
isAdmin=false
jwtHelper=new JwtHelperService()
searchQuery?: any
currentPage = 1;
totalComplaintCount = 0;
complaints: any;
headers: any
complaintToUpdate:any
paginatedEmployees: any[] = [];
pageSizes: number[] = [5,10,15, 20,25, 30,35,40,45,50];
complaintResponseForm!:FormGroup;
pageSize = this.pageSizes[0];
constructor(private employee: EmployeeService,private location:Location) { }
replyModal:any
isReply:boolean=false
toDate:any;
fromDate:any;
ngOnInit(){
  const decodedToken = this.jwtHelper.decodeToken(localStorage.getItem('token')!);
  const role: string = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  this.complaintResponseForm=new FormGroup(
    {
      response:new FormControl('',[Validators.required])
    }
  )
if(role==='ADMIN')
  {this.isAdmin=true}
  else{
    this.isEmployee=true
  }
  this.replyModal=new window.bootstrap.Modal(document.getElementById("complaintReplyModal"));
 
  this.getAllComplaints();
}
goBack(){
  this.location.back()
}
getAllComplaints() {
  this.employee.getFilterQueries(this.currentPage, this.pageSize).subscribe({
    next: (response) => {

      const paginationHeader = response.headers.get('X-Pagination');
      console.log(paginationHeader);
      const paginationData = JSON.parse(paginationHeader!);
      console.log(paginationData.TotalCount);

      this.totalComplaintCount = paginationData.TotalCount;
      this.complaints = response.body;
      console.log(this.complaints)
      //this.updatePaginatedEmployees();

    },
    error: (err: HttpErrorResponse) => {
      console.log(err);
      this.complaints = null;
    }
  })
}
get pageNumbers(): number[] {
  return Array.from({ length: this.pageCount }, (_, i) => i + 1);
}
get pageCount(): number {
  return Math.ceil(this.totalComplaintCount / this.pageSize);
}



changePage(page: number) {

  this.currentPage = page;
  this.getAllComplaints();
}
calculateSRNumber(index: number): number {
  return (this.currentPage - 1) * this.pageSize + index + 1;
}
onPageSizeChange(event: Event) {
  this.pageSize = +(event.target as HTMLSelectElement).value;
  this.getAllComplaints();
}
onSearch() {
  this.isSearch=true
  this.employee.getFilterQueries(this.currentPage, this.pageSize ,this.toDate,this.fromDate).subscribe({
    next: (response) => {

      const paginationHeader = response.headers.get('X-Pagination');
      console.log(paginationHeader);
      const paginationData = JSON.parse(paginationHeader!);
      console.log(paginationData.TotalCount);

      this.totalComplaintCount = paginationData.TotalCount;
      this.complaints = response.body;
      console.log(this.complaints)

    },
    error: (err: HttpErrorResponse) => {
      this.complaints=[]
      console.log(err);
    }
  })
}
resetSearch() {
  this.toDate=null;
  this.fromDate=null;
  this.getAllComplaints()
  this.isSearch=false
 }
onReply(data:any){
  this.complaintToUpdate=data;
  
  this.replyModal.show();
  
}

updateComplaint(){
 console.log(this.complaintToUpdate)
 this.complaintToUpdate.response=this.complaintResponseForm.get('response')?.value!

 
 this.employee.updateQuery(this.complaintToUpdate).subscribe(
  (res)=>{
    alert('Updated Successfully')
    this.isReply=true
  },
  (err)=>{
    alert("Something went wrong")
  }
 )
 this.replyModal.hide()

}
}
