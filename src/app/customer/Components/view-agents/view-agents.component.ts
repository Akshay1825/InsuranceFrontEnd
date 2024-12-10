import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdminService } from 'src/app/Services/admin.service';

@Component({
  selector: 'app-view-agents',
  templateUrl: './view-agents.component.html',
  styleUrls: ['./view-agents.component.css']
})
export class ViewAgentsComponent {
  currentPage = 1;
  totalAgentCount = 0;
  agents: any;
  headers: any
  paginatedAgent: any[] = [];
  oldAgentObj: any
  pageSizes: number[] = [3,10, 20, 30];

  pageSize = this.pageSizes[0];
  searchQuery:string|number='';
  isAdmin=false
  isEmployee=false
 
  constructor(private admin: AdminService, private location: Location) { }
  ngOnInit(): void {
    this.getAgents();
  
  }
  getAgents(){
    this.admin.getFilterAgents(this.currentPage, this.pageSize,this.searchQuery).subscribe({
      next: (response: { headers: { get: (arg0: string) => any; }; body: any; }) => {

        const paginationHeader = response.headers.get('X-Pagination');
          console.log(paginationHeader);
          const paginationData = JSON.parse(paginationHeader!);
           console.log(paginationData.TotalCount);

          this.totalAgentCount=paginationData.TotalCount;
        this.agents = response.body;
        console.log(this.agents)
             //this.updatePaginatedEmployees();

      },
      error:(err:HttpErrorResponse)=>{
        this.agents=null;
        console.log(err.message);

      }
    })
  }
  get pageNumbers(): number[] {
    return Array.from({ length: this.pageCount }, (_, i) => i + 1);
  }
  get pageCount(): number {
    return Math.ceil(this.totalAgentCount / this.pageSize);
  }



  changePage(page: number) {
   
    this.currentPage = page;
    this.getAgents();
  }
  calculateSRNumber(index: number): number {
    return (this.currentPage - 1) * this.pageSize + index + 1;
  }
  onPageSizeChange(event:Event){
    this.pageSize = +(event.target as HTMLSelectElement).value;
    this.getAgents();
  }
  updatePaginatedEmployees() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedAgent = this.agents.slice(start, end);
  }
  onEdit(agentObj: any) {
    this.oldAgentObj = JSON.stringify(agentObj);
    this.paginatedAgent.forEach(element => {
      element.isEdit = false;
    });
    agentObj.isEdit = true;
  }
  onUpdate(agentObj: any) {
    debugger
    delete agentObj.isEditable;
    console.log(agentObj)
    this.admin.updateAgent(agentObj).subscribe({
      next: (data: any) => {
        console.log(data);
        alert("Updated Successfully")
        location.reload()
      },
      error: (error: HttpErrorResponse) => {

        console.log(error);
      }


    })
   agentObj.isEditable = !agentObj.isEditable
  }
  onCancel(obj: any) {
    const oldObj = JSON.parse(this.oldAgentObj);
    obj.agentFirstName = oldObj.agentFirstName;
    obj.agentLastName = oldObj.agentLastName,
    obj.email=oldObj.email,
    obj.qualification=oldObj.qualification
    obj.phone = oldObj.phone,
    obj.status=oldObj.status
      
      obj.isEdit = false;
  }
  onDelete(agent: any) {
    debugger
    this.admin.deleteAgent(agent.agentId).subscribe({
      next: (data: any) => {
        console.log(data)
        alert("Deleted Successfully");
        location.reload();

      },
      error(error: HttpErrorResponse) {
        console.log(error.message)
      }
    })
  }

 
  onSearch() {
   
   
    this.getAgents();
  }
  goBack(){
    this.location.back()
  }
}
