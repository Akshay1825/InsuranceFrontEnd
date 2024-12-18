import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  baseURL='https://localhost:7117/api'
  constructor(private http:HttpClient) { }
  getProfile():Observable<any> {  
    let name=localStorage.getItem('userName');
    return this.http.get(this.baseURL+"/Employee/getProfile?userName="+name,{observe:'response'});
  }
  updateEmployee(data:any):Observable<any> {  
    return this.http.put(this.baseURL+"/Employee",data,{observe:'response'});
  }
  containsOnlyDigits(s: string) {
    return /^\d+$/.test(s);
  }
  getFilterQueries(pgNo?: number, pgSize?: number, toDate?: string,fromDate?:string): Observable<any> {
    var searchUrl = this.baseURL+`/Complaint/get?PageNumber=${pgNo}&PageSize=${pgSize}`;
    if (fromDate) {
      searchUrl += `&FromDate=${fromDate}`;
    }
    if (toDate) {
      searchUrl += `&ToDate=${toDate}`;
    }
  
    return this.http.get(searchUrl, { observe: 'response' });

  }
  updateQuery(data:any):Observable<any> {
    return this.http.put(this.baseURL+"/Complaint",data,{ observe: 'response' });

  }
  getClaims(pgNo?: number, pgSize?: number, toDate?: string,fromDate?:string){
    var searchUrl = this.baseURL+`/Claimm/get?PageNumber=${pgNo}&PageSize=${pgSize}`;
    if (fromDate) {
      searchUrl += `&FromDate=${fromDate}`;
    }
    if (toDate) {
      searchUrl += `&ToDate=${toDate}`;
    }
    return this.http.get(searchUrl, { observe: 'response' });
   
  }
  updateClaims(data:any)
  {
   return this.http.put(this.baseURL+"Claim/update",data);

  }
}
