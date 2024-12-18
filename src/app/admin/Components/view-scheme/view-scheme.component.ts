import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { AdminService } from 'src/app/Services/admin.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-scheme',
  templateUrl: './view-scheme.component.html',

  styleUrls: ['./view-scheme.component.css']
})
export class ViewSchemeComponent {

  pageSize = 10;
  currentPage = 1;
  totalSchemeCount = 0;
  headers:any
  paginatedPlans: any[] = [];
  searchQuery:string|number='';
  planId!:any
  planSchemes: any
  schemeToUpdate:any
  pageSizes: any=[5,10,15,20,25,30,35,40,45,50];
  isSearch: boolean=false;

  constructor(private admin: AdminService, private route:Router,private activatedroute:ActivatedRoute,private location:Location) {}
  ngOnInit(){
    this.planId = this.activatedroute.snapshot.paramMap.get('id');
    if (!this.planId) {
    console.error('Plan ID not found in route parameters.');
    } 
    this.getSchemes();
  }
  goBack(){
    this.location.back()
  }
getSchemes(){
  this.admin.getSchemeByPlanID(this.planId,this.currentPage, this.pageSize,this.searchQuery).subscribe({
    next:(res)=>{
      console.log(res);
      const paginationHeader = res.headers.get('X-Pagination');
          console.log(paginationHeader);
          const paginationData = JSON.parse(paginationHeader!);
           console.log(paginationData.TotalCount);

          this.totalSchemeCount=paginationData.TotalCount;
      this.planSchemes=res.body;
      console.log(this.planSchemes)
      if (!Array.isArray(this.planSchemes) || this.planSchemes.length === 0) {
        alert("No Schemes Found Under this Plan");
        // this.goBack();
        return;
      }
    },
    error:(err:HttpErrorResponse)=>{
      if (!Array.isArray(this.planSchemes) || this.planSchemes.length === 0) {
        alert("No Schemes Found Under this Plan");
        // this.goBack();
        return;
      }
      this.planSchemes=[]
      console.log("Could not fetch data");
    }
  })
}
get pageNumbers(): number[] {
  return Array.from({ length: this.pageCount }, (_, i) => i + 1);
}
get pageCount(): number {
  return Math.ceil(this.totalSchemeCount / this.pageSize);
}
changePage(page: number) {
 
  this.currentPage = page;
  this.getSchemes();
}
calculateSRNumber(index: number): number {
  return (this.currentPage - 1) * this.pageSize + index + 1;
}
onPageSizeChange(event:Event){
  this.pageSize = +(event.target as HTMLSelectElement).value;
  this.getSchemes();
}

onSearch(){
this.getSchemes()
this.isSearch=!this.isSearch
}
addScheme() {
  this.route.navigateByUrl('/admin/add/scheme/'+this.planId)
  }

UpdateSchemeData(scheme:any)
{
  console.log(scheme.schemeId);
  this.route.navigateByUrl('/admin/update/scheme/'+scheme.schemeId)
}
resetSearch(){
  this.searchQuery=''
  this.getSchemes()
  this.isSearch=false

}


Delete(data:any)
{
  this.admin.deleteScheme(data).subscribe({
    next: (res) => {
      alert('Scheme Updated successfully');
      this.getSchemes(); 
    },
    error: (err) => {
      console.error('Error while deleting scheme:', err);
      alert('Failed to delete the scheme. Please try again.');
    },
  });
}
ActivateScheme(scheme: any): void {
  console.log(scheme);
  scheme.isActive = true; // Update locally for instant UI feedback
  this.admin.updateScheme(scheme).subscribe({
    next: (res) => {
      alert('Scheme activated successfully.');
      this.getSchemes(); // Refresh the list if necessary
    },
    error: (err) => {
      console.error('Error activating scheme:', err);
      alert('Failed to activate the scheme. Please try again.');
    },
  });
}
}


