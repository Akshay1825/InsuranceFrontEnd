import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRegisterComponent } from './register/customer-register/customer-register.component';

import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { HomeModule } from '../home/home.module';
import { LoginComponent } from './login/login.component';




@NgModule({
  declarations: [
    CustomerRegisterComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    HomeModule
  ],
  exports:[CustomerRegisterComponent]
})
export class AuthModule { }
