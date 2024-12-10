import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RecaptchaModule } from 'ng-recaptcha';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AgentModule } from './agent/agent.module';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptorInterceptor } from './jwt-interceptor.interceptor';
import { AdminModule } from './admin/admin.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CustomerModule } from './customer/customer.module';
import { EmployeeModule } from './employee/employee.module';
import { SharedModule } from './shared/shared.module';
import { AuthGuard } from './Guards/authentication.guard';
import { TableModule } from "primeng/table"
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RazorpayComponent } from './razorpay/razorpay.component';
import { SampleComponent } from './Samples/sample/sample.component';
// import { JwtInterceptor } from '@auth0/angular-jwt';
// import { AuthService } from './Services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    ChangePasswordComponent,
    RazorpayComponent,
    SampleComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    CustomerModule,
    AgentModule,
    AuthModule,
    AdminModule,
    EmployeeModule,
    HomeModule,
    RecaptchaModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    TableModule
    
    
    
    
    

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: JwtInterceptorInterceptor,
      multi: true
      
       
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
