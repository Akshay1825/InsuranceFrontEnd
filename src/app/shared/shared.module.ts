import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertComponent } from './alert/alert.component';
import { FooterComponent } from './footer/footer.component';
import { FooterOtherComponent } from './footer-other/footer-other.component';
import { PremiumShareComponent } from './premium-share/premium-share.component';



@NgModule({
  declarations: [

    AlertComponent,
     FooterComponent,
     FooterOtherComponent,
     PremiumShareComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [AlertComponent,FooterComponent,FooterOtherComponent]
})
export class SharedModule { }
