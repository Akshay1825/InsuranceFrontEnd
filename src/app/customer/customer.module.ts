import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerHeaderComponent } from './Components/customer-header/customer-header.component';

import { AppRoutingModule } from '../app-routing.module';
import { DashboardComponent } from './dashboard.component';
import { CustomerIschemeComponent } from './Components/customer-ischeme/customer-ischeme.component';
import { CustomerProfileComponent } from './Components/customer-profile/customer-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BuyPolicyComponent } from './Components/buy-policy/buy-policy.component';
import { PoliciesComponent } from './Components/policies/policies.component';
import { AddComplaintComponent } from './Components/add-complaint/add-complaint.component';
import { ViewComplaintComponent } from './Components/view-complaint/view-complaint.component';
import { CustomerBodyComponent } from './Components/customer-body/customer-body.component';
import { DocumentComponent } from './Components/document/document.component';
import { ViewAgentsComponent } from './Components/view-agents/view-agents.component';

import { SharedModule } from '../shared/shared.module';
import { NgxPrintModule } from 'ngx-print';
import { ReceiptComponent } from './Components/receipt/receipt.component';
import { PolicyComponent } from './Components/policy/policy.component';
import { AgentModule } from '../agent/agent.module';
import { PaymentComponent } from './Components/payment/payment.component';
import { CustomerClaimsComponent } from './Components/customer-claims/customer-claims.component';

@NgModule({
  declarations: [
    CustomerHeaderComponent,
    DashboardComponent,
    CustomerIschemeComponent,
    CustomerProfileComponent,
    BuyPolicyComponent,
    PoliciesComponent,
    AddComplaintComponent,
    ViewComplaintComponent,
    CustomerBodyComponent,
    DocumentComponent,
    ViewAgentsComponent,
    ReceiptComponent,
    PolicyComponent,
    PaymentComponent,
    CustomerClaimsComponent,


  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgxPrintModule,
    AgentModule
  ],
  exports: [CustomerHeaderComponent,]
})
export class CustomerModule { }
