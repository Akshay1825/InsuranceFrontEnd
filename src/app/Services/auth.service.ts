import { PlatformLocation } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  login(userName: string, password: string): Observable<any>{
    return this.http.post(this.baseUrl,{userName, password },{observe:'response'});
  }
  customerSignUp(data: any) {
    return this.http.post(this.baseUrl2 , data);
  }
  // checkUsernameExistence(userName: string): Observable<{ usernameExists: boolean }> {
  //   return this.http.get<{ usernameExists: boolean }>(`https://localhost:7117/api/Customer/check-existence?userName=${userName}`);
  // }

  // Check if email exists
  checkEmailExistence(email: string): Observable<{ emailExists: boolean }> {
    return this.http.get<{ emailExists: boolean }>(`https://localhost:7117/api/Customer/check-existence?email=${email}`);
  }

  // Check if mobile number exists
  checkMobileExistence(mobileNumber: string): Observable<{ mobileExists: boolean }> {
    return this.http.get<{ mobileExists: boolean }>(`https://localhost:7117/api/Customer/check-existence?mobileNumber=${mobileNumber}`);
  }

  checkUsernameExistence(userName: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl2}/check-username?userName=${userName}`,{observe:'response'});
  }
  checkExistence(userName: string, email: string, mobileNumber: number): Observable<any> {
    console.log(userName);
    const params: any = {};

    if (userName) {
        params.userName = userName;
    }
    if (email) {
        params.email = email;
    }
    if (mobileNumber) {
        params.mobileNumber = mobileNumber;
    }
      
    return this.http.get<any>(`https://localhost:7117/api/Customer/check-existence`, { params });
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
      return this.http.put(this.baseUrl5 + "/changePassword", data,{observe:'response'});
    if (role =="EMPLOYEE")
      return this.http.put(this.baseUrl4 + "/changePassword", data,{observe:'response'});
    return this.http.put(this.baseUrl,data);
  }
}


