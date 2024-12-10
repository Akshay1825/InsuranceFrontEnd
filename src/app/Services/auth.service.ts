import { PlatformLocation } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl:string = 'https://localhost:7117/api/Login';
  baseUrl2:string = "https://localhost:7117/api/Customer";
  baseUrl3:string = "https://localhost:7117/api/Agent";
  baseUrl4:string = "https://localhost:7117/api/Employee";
  baseUrl5:string = "https://localhost:7117/api/Admin";

  constructor(private http: HttpClient, private router: Router, private platformLocation: PlatformLocation) { }

  login(userName: string, password: string, captchaInput:string): Observable<any>{
    return this.http.post(this.baseUrl,{userName, password, captchaInput },{observe:'response'});
  }
  customerSignUp(data: any) {
    return this.http.post(this.baseUrl2 , data);
  }
  customerLogin(data: any) {

    return this.http.post(this.baseUrl + "/Customer/login", data);

  }
  adminLogin(data: any) {
    return this.http.post(this.baseUrl + "/Admin/login", data);
  }
  agentLogin(data: any) {
    return this.http.post(this.baseUrl + "/Agent/login", data);
  }
  employeeLogin(data: any) {
    return this.http.post(this.baseUrl + "/Employee/login", data);
  }
  // login(data: any) {
  //   return this.http.post(this.baseUrl+"User/login", data);
  // }

  logOut() {
    // Clear any authentication tokens or session data
    // For example, clear a JWT token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('password');
    window.location.href = '/'



  }
  agentLogOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('password');
    localStorage.removeItem('agentId');
    window.location.href = '/'
  }
  changePassword(data: any,role:string):Observable<any>{
    if (role =="CUSTOMER")
      return this.http.put(this.baseUrl2 + "/changePassword", data,{observe:'response'});
    if (role =="AGENT")
      return this.http.put(this.baseUrl3 + "/changePassword", data,{observe:'response'});
    if (role =="ADMIN")
      return this.http.put(this.baseUrl4 + "/changePassword", data,{observe:'response'});
    if (role =="EMPLOYEE")
      return this.http.put(this.baseUrl5 + "/changePassword", data,{observe:'response'});
    return this.http.put(this.baseUrl,data);
  }
}


