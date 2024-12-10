import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminHeaderComponent } from './Components/admin-header/admin-header.component';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminBodyComponent } from './Components/admin-body/admin-body.component';
import { AddEmpComponent } from './Components/add-emp/add-emp.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddPlanComponent } from './Components/add-plan/add-plan.component';
import { ViewPlanComponent } from './Components/view-plan/view-plan.component';

import { ViewEmpComponent } from './Components/view-emp/view-emp.component';
import { ViewSchemeComponent } from './Components/view-scheme/view-scheme.component';


import { AdminProfileComponent } from './Components/admin-profile/admin-profile.component';
import { TaxPercentComponent } from './Components/tax-percent/tax-percent.component';
import { PaymentsComponent } from './Components/payments/payments.component';
import { SharedModule } from '../shared/shared.module';
import { CommissionWithdrawComponent } from './Components/commission-withdraw/commission-withdraw.component';
import { AddSchemeComponent } from './Components/add-scheme/add-scheme.component';
import { UpdateSchemeComponent } from './Components/update-scheme/update-scheme.component';













@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminHeaderComponent,
    AdminBodyComponent,
    AddEmpComponent,

    AddPlanComponent,
    ViewPlanComponent,
    ViewEmpComponent,
    ViewSchemeComponent,
   
   
    AdminProfileComponent,
    TaxPercentComponent,
    PaymentsComponent,
    CommissionWithdrawComponent,
    AddSchemeComponent,
    UpdateSchemeComponent,
   
   
  

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule

  ],
  exports: [AdminHeaderComponent, AddEmpComponent, ViewEmpComponent, ViewPlanComponent]
})
export class AdminModule { }
