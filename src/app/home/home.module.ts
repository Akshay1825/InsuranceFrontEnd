import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeHeaderComponent } from './Components/home-header/home-header.component';
import { HomeDashboardComponent } from './home-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HomeBodyComponent } from './Components/home-body/home-body.component';






@NgModule({
  declarations: [
 
  
    HomeHeaderComponent,
         HomeDashboardComponent,
         HomeBodyComponent,
         
    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  
  ],
  exports:[HomeHeaderComponent]
})
export class HomeModule { }
