import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './customer/dashboard.component';
import { HomeDashboardComponent } from './home/home-dashboard.component';
import { CustomerRegisterComponent } from './auth/register/customer-register/customer-register.component';


import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { AddEmpComponent } from './admin/Components/add-emp/add-emp.component';

import { ViewPlanComponent } from './admin/Components/view-plan/view-plan.component';
import { ViewEmpComponent } from './admin/Components/view-emp/view-emp.component';
import { ViewSchemeComponent } from './admin/Components/view-scheme/view-scheme.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CustomerIschemeComponent } from './customer/Components/customer-ischeme/customer-ischeme.component';

import { AgentDashboardComponent } from './agent/agent-dashboard.component';
import { CustomerProfileComponent } from './customer/Components/customer-profile/customer-profile.component';
import { EmployeeDashboardComponent } from './employee/employee-dashboard.component';
import { BuyPolicyComponent } from './customer/Components/buy-policy/buy-policy.component';
import { PoliciesComponent } from './customer/Components/policies/policies.component';
import { AdminProfileComponent } from './admin/Components/admin-profile/admin-profile.component';
import { AddComplaintComponent } from './customer/Components/add-complaint/add-complaint.component';
import { ViewComplaintComponent } from './customer/Components/view-complaint/view-complaint.component';
import { EmployeeProfileComponent } from './employee/Components/employee-profile/employee-profile.component';
import { AgentProfileComponent } from './agent/Components/agent-profile/agent-profile.component';
import { ViewComplaintsComponent } from './employee/Components/view-complaints/view-complaints.component';
import { DocumentComponent } from './customer/Components/document/document.component';
import { ViewAgentComponent } from './employee/Components/view-agent/view-agent.component';
import { CustomerDataComponent } from './employee/Components/customer-data/customer-data.component';
import { CustomerDocumentComponent } from './employee/Components/customer-document/customer-document.component';
import { ViewAgentsComponent } from './customer/Components/view-agents/view-agents.component';

import { RegisterCustomerComponent } from './agent/Components/register-customer/register-customer.component';
import { PaymentsComponent } from './admin/Components/payments/payments.component';

import { ReceiptComponent } from './customer/Components/receipt/receipt.component';
import { AgentCustomerComponent } from './agent/Components/agent-customer/agent-customer.component';
import { RegisterPolicyComponent } from './agent/Components/register-policy/register-policy.component';
import { ClaimComponent } from './employee/Components/claim/claim.component';
import { PlanComponent } from './agent/Components/plan/plan.component';
import { SchemeComponent } from './agent/Components/scheme/scheme.component';
import { ComissionComponent } from './agent/Components/comission/comission.component';

import { AgentCustDocumentComponent } from './agent/Components/agent-cust-document/agent-cust-document.component';
import { PolicyComponent } from './customer/Components/policy/policy.component';
import { AdminAgentCommissionComponent } from './employee/Components/admin-agent-commission/admin-agent-commission.component';
import { CommissionWithdrawComponent } from './admin/Components/commission-withdraw/commission-withdraw.component';
import { CustomerPolicyComponent } from './employee/Components/customer-policy/customer-policy.component';
import { TaxPercentComponent } from './admin/Components/tax-percent/tax-percent.component';
import { LoginComponent } from './auth/login/login.component';
import { AddPlanComponent } from './admin/Components/add-plan/add-plan.component';
import { AddAgentComponent } from './employee/Components/add-agent/add-agent.component';
import { AddSchemeComponent } from './admin/Components/add-scheme/add-scheme.component';
import { UpdateSchemeComponent } from './admin/Components/update-scheme/update-scheme.component';
import { PaymentComponent } from './customer/Components/payment/payment.component';
import { AgentCustomerPolicyComponent } from './agent/Components/agent-customer-policy/agent-customer-policy.component';
import { CustomerClaimsComponent } from './customer/Components/customer-claims/customer-claims.component';
import { AuthGuard } from './Guards/authentication.guard';
import { AuthService } from './Services/auth.service';
import { SampleComponent } from './Samples/sample/sample.component';

const routes: Routes = [
  {
    path: '',
    component: HomeDashboardComponent
  },
  {
     path : 'sample/:policyId',
     component: SampleComponent
  },
  {
    path: 'customer', component: DashboardComponent,
    canActivate:[AuthGuard],data:{roles:['CUSTOMER']}
  },
  {
    path: 'customer/plan/:id', component: CustomerIschemeComponent
  },

  {
    path: 'admin', 
    component: AdminDashboardComponent,canActivate:[AuthGuard],data:{roles:['ADMIN']}
  },
  {
    path: 'admin/viewEmployee', component: ViewEmpComponent
  },
  {
  path:'admin/addEmployee',component:AddEmpComponent
  },
  {
    path: 'admin/viewAgent', component: ViewAgentComponent
  },
  {
    path: 'employee/viewAgent', component: ViewAgentComponent
  }
  ,
  {
    path: 'admin/viewPlan', component: ViewPlanComponent
  },
  {
    path: 'admin/addPlan', component: AddPlanComponent
  },
  {
    path: 'auth', component: CustomerRegisterComponent,
  },
 {
    path:'login',component:LoginComponent
  }
  ,
 
  {
    path: 'admin/viewScheme/:id', component: ViewSchemeComponent
  },
  {
    path: 'dashboard/changePassword', component: ChangePasswordComponent
  },
  {
    path: 'agent', component: AgentDashboardComponent,canActivate:[AuthGuard],data:{roles:['AGENT']}
  },
  {
    path: 'customer/profile', component: CustomerProfileComponent
  },
  {
    path: 'admin/profile', component: AdminProfileComponent
  },
  {
    path: 'employee', component: EmployeeDashboardComponent,canActivate:[AuthGuard],data:{roles:['EMPLOYEE']}
  },
  {
    path: 'customer/buyPolicy', component: BuyPolicyComponent
  },
  {
    path: 'customer/policies', component: PoliciesComponent
  },
  {
    path: 'customer/enquiry', component: AddComplaintComponent
  },
  {
    path: 'customer/complaints', component: ViewComplaintComponent
  },
  {
    path: 'employee/profile', component: EmployeeProfileComponent
  },
  {
    path: 'agent/profile', component: AgentProfileComponent
  },
  {
    path: 'admin/complaints', component: ViewComplaintsComponent
  },
  {
    path: 'employee/complaints', component: ViewComplaintsComponent
  },
  {
    path: 'customer/documents', component: DocumentComponent
  },
  {
    path: 'employee/customers', component: CustomerDataComponent
  },
  {
    path: 'employee/addagent', component: AddAgentComponent
  },
  {
    path: 'admin/customers', component: CustomerDataComponent
  },
  {
    path: 'admin/customers/document/:id', component: CustomerDocumentComponent
  },
  {
    path: 'employee/customers/document/:id', component: CustomerDocumentComponent
  },
  {
   path:'agent/customers/document/:id',component:AgentCustDocumentComponent
  },
  {
    path:'employee/customers/policies/:id',component:CustomerPolicyComponent
   },
   {
    path:'admin/customers/policies/:id',component:CustomerPolicyComponent
   },

  {
    path: 'customer/agents', component: ViewAgentsComponent
  },

  {
    path: 'agent/register/customer', component: RegisterCustomerComponent
  },
  {
    path: 'admin/payments', component: PaymentsComponent
  },
  {
    path: 'customer/Policies/:id', component: PolicyComponent
  },
  {
    path: 'payment/receipt/:index/:policyId', component: ReceiptComponent
  },
{
  path:'agent/customers',component:AgentCustomerComponent
},
{
  path:'agent/register/policy',component:RegisterPolicyComponent
},{
  path:'admin/cliams',component:ClaimComponent
},
{
  path:'employee/cliams',component:ClaimComponent
},
{
  path:'agent/view/plans',component:PlanComponent
},{
  path:'agent/view/plan/:id',component:SchemeComponent
},
{
  path:'agent/commissions',component:ComissionComponent
},{
  path:'admin/commissions/withdraw',component:CommissionWithdrawComponent
},{
  path:'employee/agents/commission/:id',component:AdminAgentCommissionComponent
},
{
  path:'settings/tax',component:TaxPercentComponent
},
{
  path:'admin/add/scheme/:id',component:AddSchemeComponent
},
{
  path:'admin/update/scheme/:id',component:UpdateSchemeComponent
},
{
  path:'customer/policy/pay/4143510b-f27b-416f-c4fb-08dd17526c30',component:PaymentComponent
},
{
  path:'agent/customer/policies',component:AgentCustomerPolicyComponent
},
{
  path:'customer/claims',component:CustomerClaimsComponent
}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
