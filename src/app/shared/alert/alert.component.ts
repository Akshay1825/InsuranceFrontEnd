

import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input()
  message!: string;
  private timerSubscription!: Subscription;
  showAlert = true;

  ngOnInit() {
    this.setAutoDismissTimer();
  }

  setAutoDismissTimer() {
    this.timerSubscription = timer(5000).subscribe(() => {
      this.dismissAlert();
    });
  }

  dismissAlert() {
    this.showAlert = false;
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
