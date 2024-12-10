import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentHeaderComponent } from './Components/agent-header/agent-header.component';
import { AgentDashboardComponent } from './agent-dashboard.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgentProfileComponent } from './Components/agent-profile/agent-profile.component';
import { AgentBodyComponent } from './Components/agent-body/agent-body.component';
import { RegisterCustomerComponent } from './Components/register-customer/register-customer.component';
import { SharedModule } from '../shared/shared.module';
import { AgentCustomerComponent } from './Components/agent-customer/agent-customer.component';
import { EmployeeModule } from '../employee/employee.module';
import { AgentCustDocumentComponent } from './Components/agent-cust-document/agent-cust-document.component';
import { RegisterPolicyComponent } from './Components/register-policy/register-policy.component';
import { PlanComponent } from './Components/plan/plan.component';
import { SchemeComponent } from './Components/scheme/scheme.component';
import { ComissionComponent } from './Components/comission/comission.component';
import { AgentCustomerPolicyComponent } from './Components/agent-customer-policy/agent-customer-policy.component';
import { CustomerModule } from '../customer/customer.module';










@NgModule({
  declarations: [
    AgentHeaderComponent,
    AgentDashboardComponent,
    AgentProfileComponent,
    AgentBodyComponent,
    RegisterCustomerComponent,
    AgentCustomerComponent,
    AgentCustDocumentComponent,
    RegisterPolicyComponent,
    PlanComponent,
    SchemeComponent,
    ComissionComponent,
    AgentCustomerPolicyComponent,
  
 
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    
  
  ],
  exports:[AgentHeaderComponent]
})
export class AgentModule {

 }
