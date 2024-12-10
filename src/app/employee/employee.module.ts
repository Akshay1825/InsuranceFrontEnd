import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeDashboardComponent } from './employee-dashboard.component';
import { EmployeeHeaderComponent } from './Components/employee-header/employee-header.component';

import { EmployeeProfileComponent } from './Components/employee-profile/employee-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewComplaintsComponent } from './Components/view-complaints/view-complaints.component';
import { ViewAgentComponent } from './Components/view-agent/view-agent.component';

import { CustomerDocumentComponent } from './Components/customer-document/customer-document.component';
import { EmployeeBodyComponent } from './Components/employee-body/employee-body.component';
import { SharedModule } from '../shared/shared.module';
import { CustomerDataComponent } from './Components/customer-data/customer-data.component';
import { ClaimComponent } from './Components/claim/claim.component';
import { AdminAgentCommissionComponent } from './Components/admin-agent-commission/admin-agent-commission.component';
import { AdminModule } from '../admin/admin.module';
import { CustomerPolicyComponent } from './Components/customer-policy/customer-policy.component';
import { AddAgentComponent } from './Components/add-agent/add-agent.component';



@NgModule({
  declarations: [
    EmployeeDashboardComponent,
    EmployeeHeaderComponent,
    EmployeeProfileComponent,
    ViewComplaintsComponent,
    ViewAgentComponent,
    CustomerDataComponent,
    CustomerDocumentComponent,
    EmployeeBodyComponent,
    ClaimComponent,
    AdminAgentCommissionComponent,
    AddAgentComponent,
    CustomerPolicyComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AdminModule
   
  ],
  exports:[EmployeeHeaderComponent,CustomerDocumentComponent]
})
export class EmployeeModule { }
