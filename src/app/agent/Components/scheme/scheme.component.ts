import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/Services/admin.service';

@Component({
  selector: 'app-scheme',
  templateUrl: './scheme.component.html',
  styleUrls: ['./scheme.component.css']
})
export class SchemeComponent {
  
  currentPage = 1;
  totalSchemeCount = 0;
  headers:any
  paginatedPlans: any[] = [];
  searchQuery:string|number='';
  planId!:any
  planSchemes: any={}
  schemeDetail:any={}
  pageSizes=[5,10,20,30]
  pageSize = this.pageSizes[0];
  constructor(private admin: AdminService, private location: Location,private activatedroute:ActivatedRoute) {}
   

  ngOnInit(){
    this.planId = this.activatedroute.snapshot.paramMap.get('id');
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
    },
    error:(err:HttpErrorResponse)=>{
      this.planSchemes=null
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
}
showDetail(scheme:any){
    console.log(scheme)
    // this.['minAge']
    this.schemeDetail=scheme
    console.log(this.schemeDetail);
    console.log(this.schemeDetail.minAge);
}


}
