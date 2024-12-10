import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private dataTransfer = new Subject<{ obj1: any; obj2: any;obj3: any;obj4: any }>();
  dataTransfer$ = this.dataTransfer.asObservable();

  sendData(obj1: any, obj2: any, obj3: any, obj4: any) {
    this.dataTransfer.next({ obj1, obj2 ,obj3, obj4 });
  }

  
}
